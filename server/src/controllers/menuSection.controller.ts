import { MenuSection } from "../models/MenuSection.js";
import { Type } from "../models/Type.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { SectionMenuItems } from "../models/SectionMenuItems.js";
import { sequelize } from "../config/database.js";
import { getIdParam } from "../utils/validateId.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";

export const getAllSections = asyncHandler(async (req: Request, res: Response) => {
    const { typeId } = req.query;
    const where: any = {};
    if (typeId && typeof typeId === "string") {
        where.typeId = typeId;
    }

    const sections = await MenuSection.findAll({
        where,
        include: [
            { model: Type },
            { model: FilterMenu, through: { attributes: [] } },
        ],
        order: [
            [sequelize.literal(`CASE WHEN "MenuSection"."name" = 'Promosi' THEN 0 ELSE 1 END`), "ASC"],
            ["name", "ASC"],
        ],
    });

    return res.json({ success: true, data: sections });
});

export const getSectionById = asyncHandler(async (req: Request, res: Response) => {
    try {
        const id = getIdParam(req);
        const section = await MenuSection.findByPk(id, {
            include: [
                { model: Type },
                { model: FilterMenu, through: { attributes: [] } },
            ],
        });
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }
        return res.json({ success: true, data: section });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching section", error });
    }
});

export const createSection = asyncHandler(async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, typeId, filterIds } = req.body;

        if (!name || !typeId) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "name & typeId required" });
        }

        const type = await Type.findByPk(typeId);
        if (!type) {
            await t.rollback();
            return res.status(400).json({ success: false, message: "Invalid typeId" });
        }

        const section = await MenuSection.create(
            { name, description, typeId },
            { transaction: t }
        );

        // Link filters via Section_Menu_Items
        if (filterIds && Array.isArray(filterIds) && filterIds.length > 0) {
            const items = filterIds.map((filterMenuId: string) => ({
                sectionMenuId: section.id,
                filterMenuId,
            }));
            await SectionMenuItems.bulkCreate(items, { transaction: t });
        }

        await t.commit();

        // Re-fetch with relations
        const result = await MenuSection.findByPk(section.id, {
            include: [
                { model: Type },
                { model: FilterMenu, through: { attributes: [] } },
            ],
        });

        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: "Error creating section", error });
    }
});

export const updateSection = asyncHandler(async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const id = getIdParam(req);
        const section = await MenuSection.findByPk(id);
        if (!section) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        const { name, description, typeId, filterIds } = req.body;
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (typeId !== undefined) {
            const type = await Type.findByPk(typeId);
            if (!type) {
                await t.rollback();
                return res.status(400).json({ success: false, message: "Invalid typeId" });
            }
            updateData.typeId = typeId;
        }

        await section.update(updateData, { transaction: t });

        // Replace filter links if filterIds provided
        if (filterIds !== undefined && Array.isArray(filterIds)) {
            await SectionMenuItems.destroy({
                where: { sectionMenuId: id },
                transaction: t,
            });
            if (filterIds.length > 0) {
                const items = filterIds.map((filterMenuId: string) => ({
                    sectionMenuId: id,
                    filterMenuId,
                }));
                await SectionMenuItems.bulkCreate(items, { transaction: t });
            }
        }

        await t.commit();

        const result = await MenuSection.findByPk(id, {
            include: [
                { model: Type },
                { model: FilterMenu, through: { attributes: [] } },
            ],
        });

        return res.json({ success: true, data: result });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: "Error updating section", error });
    }
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const id = getIdParam(req);
        const section = await MenuSection.findByPk(id, { transaction: t });
        
        if (!section) {
            await t.rollback();
            return res.status(404).json({ 
                success: false, 
                message: "Section not found" 
            });
        }

        await SectionMenuItems.destroy({
            where: { sectionMenuId: id },
            transaction: t,
        });

        // Baru delete section
        await section.destroy({ transaction: t });

        await t.commit();
        return res.json({ 
            success: true, 
            message: "Section deleted successfully" 
        });
    } catch (error) {
        await t.rollback();
        console.error("DELETE SECTION ERROR:", error);
        return res.status(500).json({ 
            message: "Error deleting section",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});