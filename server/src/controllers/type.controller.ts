import { Type } from "../models/Type.js";
import { MenuSection } from "../models/MenuSection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";

export const getAllTypes = asyncHandler(async (_req, res) => {
    const types = await Type.findAll({
        include: [{ model: MenuSection }],
        order: [["foodTypeId", "ASC"]],
    });
    res.json({ success: true, data: types });
});

export const getTypeById = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const type = await Type.findByPk(id, { include: [MenuSection] });
    if (!type) return res.status(404).json({ success: false, message: "Type not found" });
    res.json({ success: true, data: type });
});

export const createType = asyncHandler(async (req, res) => {
    const { foodTypeId, description } = req.body;
    if (!foodTypeId || !description) {
        return res.status(400).json({ success: false, message: "foodTypeId & description required" });
    }
    const type = await Type.create({ foodTypeId, description });
    res.status(201).json({ success: true, data: type });
});

export const updateType = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const type = await Type.findByPk(id);
    if (!type) return res.status(404).json({ success: false, message: "Not found" });
    await type.update(req.body);
    res.json({ success: true, data: type });
});

export const deleteType = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const type = await Type.findByPk(id);
    if (!type) return res.status(404).json({ success: false, message: "Not found" });
    await type.destroy();
    res.json({ success: true, message: "Type deleted" });
});