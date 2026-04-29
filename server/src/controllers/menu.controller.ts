import { Menu } from "../models/menu.js";
import { FilterMenu } from "../models/filterMenu.js";
import { MenuSection } from "../models/menuSection.js";
import { Type } from "../models/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";
import fs from "fs";
import path from "path";

export const getAllMenus = asyncHandler(async (req, res) => {
    const filterMenuId = req.query.filterMenuId;
    const isAvailable = req.query.isAvailable;
    const search = req.query.search;

    const where: any = {};
    if (filterMenuId && typeof filterMenuId === "string") {
        where.filterMenuId = filterMenuId;
    }
    if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === "true";
    }

    const menus = await Menu.findAll({
        where,
        include: [
            {
                model: FilterMenu,
                include: [{ model: MenuSection, include: [Type] }],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    const filtered =
        search && typeof search === "string"
            ? menus.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
            : menus;

    res.json({ success: true, data: filtered });
});

export const getMenuById = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const menu = await Menu.findByPk(id, {
        include: [{ model: FilterMenu, include: [MenuSection] }],
    });
    if (!menu) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: menu });
});

export const createMenu = asyncHandler(async (req, res) => {
    const { name, description, price, isNew, isAvailable, filterMenuId } = req.body;
    if (!name || !price) {
        return res.status(400).json({ success: false, message: "name & price required" });
    }
    const imageUrl = req.file ? `/uploads/menu/${req.file.filename}` : null;

    const menu = await Menu.create({
        name,
        description,
        price: Number(price),
        isNew: isNew === "true" || isNew === true,
        isAvailable: isAvailable === "true" || isAvailable === true,
        filterMenuId,
        imageUrl,
    });
    res.status(201).json({ success: true, data: menu });
});

export const updateMenu = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ success: false, message: "Not found" });

    const update: any = { ...req.body };
    if (update.price) update.price = Number(update.price);
    if (update.isNew !== undefined) {
        update.isNew = update.isNew === "true" || update.isNew === true;
    }
    if (update.isAvailable !== undefined) {
        update.isAvailable = update.isAvailable === "true" || update.isAvailable === true;
    }

    if (req.file) {
        if (menu.imageUrl) {
            const oldPath = path.join(process.cwd(), menu.imageUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        update.imageUrl = `/uploads/menu/${req.file.filename}`;
    }

    await menu.update(update);
    res.json({ success: true, data: menu });
});

export const toggleAvailability = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ success: false, message: "Not found" });
    await menu.update({ isAvailable: !menu.isAvailable });
    res.json({ success: true, data: menu });
});

export const deleteMenu = asyncHandler(async (req, res) => {
    const id = getIdParam(req);
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ success: false, message: "Not found" });
    await menu.destroy();
    res.json({ success: true, message: "Menu deleted" });
});