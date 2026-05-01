import { MenuSection } from "../models/MenuSection.js";
import { Type } from "../models/Type.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { SectionMenuItems } from "../models/SectionMenuItems.js";
import { sequelize } from "../config/database.js";
import { getIdParam } from "../utils/validateId.js";

export const getAllSections = async (req: any, res: any) => {
    try {
        const { typeId } = req.query;
        const where: any = {};
        if (typeId && typeof typeId === "string") {
            where.typeId = typeId;
        }

        const sections = await MenuSection.findAll({
            where,
            include: [
                { model: Type },
                { model: FilterMenu, through: { attributes: [] } }, // hide junction fields
            ],
            order: [
                [sequelize.literal(`CASE WHEN "MenuSection"."name" = 'Promosi' THEN 0 ELSE 1 END`), "ASC"],
                ["name", "ASC"],
            ],
        });

        return res.json({ success: true, data: sections });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching sections", error });
    }
};

export const getSectionById = async (req: any, res: any) => {
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
};

export const createSection = async (req: any, res: any) => {
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
};

export const updateSection = async (req: any, res: any) => {
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
};

export const deleteSection = async (req: any, res: any) => {
    try {
        const id = getIdParam(req);
        const section = await MenuSection.findByPk(id);
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }
        await section.destroy();
        return res.json({ success: true, message: "Section deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting section", error });
    }
};