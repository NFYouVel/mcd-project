import { MenuSection } from "../models/MenuSection.js";
import { Type } from "../models/Type.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";

export const getAllSections = asyncHandler(async (req, res) => {
    const typeId = req.query.typeId;
    const where: any = {};
    if (typeId && typeof typeId === "string") where.typeId = typeId;

    const sections = await MenuSection.findAll({
        where,
        include: [{ model: Type }, { model: FilterMenu }],
        order: [["createdAt", "ASC"]],
    });
    res.json({ success: true, data: sections });
});

export const getSectionById = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const section = await MenuSection.findByPk(id, {
        include: [Type, FilterMenu],
    });
    if (!section) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: section });
});

export const createSection = asyncHandler(async (req, res) => {
    const { name, description, typeId } = req.body;
    if (!name || !typeId) {
        return res.status(400).json({ success: false, message: "name & typeId required" });
    }
    const section = await MenuSection.create({ name, description, typeId });
    res.status(201).json({ success: true, data: section });
});

export const updateSection = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const section = await MenuSection.findByPk(id);
    if (!section) return res.status(404).json({ success: false, message: "Not found" });
    await section.update(req.body);
    res.json({ success: true, data: section });
});

export const deleteSection = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const section = await MenuSection.findByPk(id);
    if (!section) return res.status(404).json({ success: false, message: "Not found" });
    await section.destroy();
    res.json({ success: true, message: "Section deleted" });
});