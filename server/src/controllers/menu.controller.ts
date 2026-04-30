import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Menu } from "../models/Menu.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { OrderItems } from "../models/OrderItems.js";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";
import { PackageItems } from "../models/PackageItems.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";
import { MenuSection } from "../models/MenuSection.js";

// 🔥 helper
const parseBool = (v: any) => v === true || v === "true";

// =============================================
// GET ALL MENUS
// =============================================
export const getAllMenus = asyncHandler(async (req: Request, res: Response) => {
  const { filterMenuId, isAvailable, search } = req.query;

  const where: any = {};

  if (filterMenuId) {
    where.filterMenuId = filterMenuId;
  }

  if (isAvailable !== undefined) {
    where.isAvailable = parseBool(isAvailable);
  }

  const menus = await Menu.findAll({
    where,
    include: [
      {
        model: FilterMenu,
        attributes: ["id", "name"],
      },
      {
        model: PackageItems,
        as: "packages",
      },
      {
        model: MenuVariantGroups,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const filtered =
    typeof search === "string"
      ? menus.filter((m) =>
          m.name.toLowerCase().includes(search.toLowerCase())
        )
      : menus;

  res.json({ success: true, data: filtered });
});

// =============================================
// GET MENU BY ID
// =============================================
export const getMenuById = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);

  const menu = await Menu.findByPk(id, {
    include: [
      {
        model: FilterMenu,
        attributes: ["id", "name"],
        include: [MenuSection], // OK because FilterMenu ↔ Section
      },
      {
        model: PackageItems,
        as: "packages",
      },
      {
        model: MenuVariantGroups,
      },
    ],
  });

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found",
    });
  }

  res.json({ success: true, data: menu });
});

// =============================================
// CREATE MENU
// =============================================
export const createMenu = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    isNew,
    isAvailable,
    isPackage,
    filterMenuId,
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "name & price required",
    });
  }

  // ✅ validate FK
  if (filterMenuId) {
    const filter = await FilterMenu.findByPk(filterMenuId);
    if (!filter) {
      return res.status(400).json({
        success: false,
        message: "Invalid filterMenuId",
      });
    }
  }

  const imageUrl = req.file
    ? `/uploads/menu/${req.file.filename}`
    : null;

  const menu = await Menu.create({
    name,
    description,
    price: Number(price),
    isNew: parseBool(isNew),
    isAvailable: parseBool(isAvailable),
    isPackage: parseBool(isPackage),
    filterMenuId,
    imageUrl,
  });

  res.status(201).json({
    success: true,
    data: menu,
  });
});

// =============================================
// UPDATE MENU
// =============================================
export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id);

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found",
    });
  }

  const {
    name,
    description,
    price,
    isNew,
    isAvailable,
    isPackage,
    filterMenuId,
  } = req.body;

  // ✅ validate FK
  if (filterMenuId) {
    const filter = await FilterMenu.findByPk(filterMenuId);
    if (!filter) {
      return res.status(400).json({
        success: false,
        message: "Invalid filterMenuId",
      });
    }
  }

  const update: any = {};

  if (name !== undefined) update.name = name;
  if (description !== undefined) update.description = description;
  if (price !== undefined) update.price = Number(price);
  if (isNew !== undefined) update.isNew = parseBool(isNew);
  if (isAvailable !== undefined) update.isAvailable = parseBool(isAvailable);
  if (isPackage !== undefined) update.isPackage = parseBool(isPackage);
  if (filterMenuId !== undefined) update.filterMenuId = filterMenuId;

  // 🔥 handle image replace
  if (req.file) {
    if (menu.imageUrl) {
      const oldPath = path.join(process.cwd(), menu.imageUrl);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }
    }

    update.imageUrl = `/uploads/menu/${req.file.filename}`;
  }

  await menu.update(update);

  res.json({
    success: true,
    data: menu,
  });
});

// =============================================
// TOGGLE AVAILABILITY
// =============================================
export const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id);

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found",
    });
  }

  await menu.update({
    isAvailable: !menu.isAvailable,
  });

  res.json({
    success: true,
    data: menu,
  });
});

// =============================================
// DELETE MENU
// =============================================
export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id);

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found",
    });
  }

  // 🚫 prevent delete if used
  const existingOrderItems = await OrderItems.findOne({
    where: { menuId: id },
  });

  if (existingOrderItems) {
    return res.status(400).json({
      success: false,
      message: "Menu already used in orders",
    });
  }

  // cleanup relations
  await PackageItems.destroy({ where: { packageId: id } });
  await PackageItems.destroy({ where: { packageItemId: id } });
  await MenuVariantGroups.destroy({ where: { menuId: id } });

  // delete image
  if (menu.imageUrl) {
    const imgPath = path.join(process.cwd(), menu.imageUrl);
    if (fs.existsSync(imgPath)) {
      try {
        fs.unlinkSync(imgPath);
      } catch (err) {
        console.warn("Failed to delete image:", err);
      }
    }
  }

  await menu.destroy();

  res.json({
    success: true,
    message: "Menu deleted",
  });
});