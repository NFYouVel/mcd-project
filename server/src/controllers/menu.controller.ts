import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { Menu } from "../models/Menu.js";
import { MenuSection } from "../models/MenuSection.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { MenuSection } from "../models/MenuSection.js";
import { OrderItems } from "../models/OrderItems.js";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";
import { PackageItems } from "../models/PackageItems.js";
// import { VariantGroups } from "../models/VariantGroups.js"; // 👈 import kalo lo udah punya

import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";

// =============================================
// GET ALL MENUS
// =============================================
export const getAllMenus = asyncHandler(async (req: Request, res: Response) => {
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
    search && typeof search === "string"
      ? menus.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
      : menus;

  res.json({ success: true, data: filtered });
});

// =============================================
// GET MENU BY ID
// =============================================
export const getMenuById = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id, {
    include: [
      {
        model: FilterMenu,
        include: [MenuSection],
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
  if (!menu) return res.status(404).json({ success: false, message: "Menu not found" });
  res.json({ success: true, data: menu });
});

// =============================================
// CREATE MENU (with image upload)
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
    return res.status(400).json({ success: false, message: "name & price required" });
  }

  // -------------------------------
  // Validate filterMenuId
  // -------------------------------
  if (filterMenuId) {
    const filter = await FilterMenu.findByPk(filterMenuId);
    if (!filter) {
      return res.status(400).json({ success: false, message: "Invalid filterMenuId" });
    }
  }

  // -------------------------------
  // Image URL from multer
  // -------------------------------
  const imageUrl = req.file ? `/uploads/menu/${req.file.filename}` : null;

  // -------------------------------
  // Parse package & variant data (FormData kirim string)
  // -------------------------------
  let packageItems: any[] = [];
  let variantGroupIds: string[] = [];
  try {
    if (req.body.packageItems) {
      packageItems = typeof req.body.packageItems === "string"
        ? JSON.parse(req.body.packageItems)
        : req.body.packageItems;
    }
    if (req.body.variantGroupIds) {
      variantGroupIds = typeof req.body.variantGroupIds === "string"
        ? JSON.parse(req.body.variantGroupIds)
        : req.body.variantGroupIds;
    }
  } catch {
    return res.status(400).json({ success: false, message: "Invalid packageItems or variantGroupIds JSON" });
  }

  // -------------------------------
  // Create menu
  // -------------------------------
  const menu = await Menu.create({
    name,
    description,
    price: Number(price),
    isNew: isNew === "true" || isNew === true,
    isAvailable: isAvailable === "true" || isAvailable === true,
    isPackage: isPackage === "true" || isPackage === true,
    filterMenuId,
    imageUrl,
  });

  // -------------------------------
  // Create package items
  // -------------------------------
  if ((isPackage === "true" || isPackage === true) && packageItems.length > 0) {
    for (const item of packageItems) {
      const existingMenu = await Menu.findByPk(item.itemId);
      if (!existingMenu) {
        return res.status(400).json({
          success: false,
          message: `Invalid package item ID: ${item.itemId}`,
        });
      }
      await PackageItems.create({
        packageId: menu.id,
        packageItemId: item.itemId,
        quantity: item.quantity,
      });
    }
  }

  // -------------------------------
  // Create variant groups
  // -------------------------------
  if (variantGroupIds.length > 0) {
    for (const variantGroupId of variantGroupIds) {
      // Kalo lo punya model VariantGroups, validate dulu:
      // const vg = await VariantGroups.findByPk(variantGroupId);
      // if (!vg) {
      //   return res.status(400).json({ success: false, message: `Invalid variantGroupId: ${variantGroupId}` });
      // }
      await MenuVariantGroups.create({
        menuId: menu.id,
        variantGroupId,
      });
    }
  }

  res.status(201).json({ success: true, data: menu });
});

// =============================================
// UPDATE MENU (with image upload)
// =============================================
export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id);
  if (!menu) {
    return res.status(404).json({ success: false, message: "Menu not found" });
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

  // -------------------------------
  // Validate filterMenuId
  // -------------------------------
  if (filterMenuId) {
    const filter = await FilterMenu.findByPk(filterMenuId);
    if (!filter) {
      return res.status(400).json({ success: false, message: "Invalid filterMenuId" });
    }
  }

  // -------------------------------
  // Build update payload
  // -------------------------------
  const update: any = {};
  if (name !== undefined) update.name = name;
  if (description !== undefined) update.description = description;
  if (price !== undefined) update.price = Number(price);
  if (isNew !== undefined) update.isNew = isNew === "true" || isNew === true;
  if (isAvailable !== undefined) update.isAvailable = isAvailable === "true" || isAvailable === true;
  if (isPackage !== undefined) update.isPackage = isPackage === "true" || isPackage === true;
  if (filterMenuId !== undefined) update.filterMenuId = filterMenuId;

  // -------------------------------
  // Handle image upload (replace old)
  // -------------------------------
  if (req.file) {
    // Delete old image if exists
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

  // -------------------------------
  // Parse & update package items
  // -------------------------------
  let packageItems: any[] = [];
  let variantGroupIds: string[] = [];
  try {
    if (req.body.packageItems) {
      packageItems = typeof req.body.packageItems === "string"
        ? JSON.parse(req.body.packageItems)
        : req.body.packageItems;
    }
    if (req.body.variantGroupIds) {
      variantGroupIds = typeof req.body.variantGroupIds === "string"
        ? JSON.parse(req.body.variantGroupIds)
        : req.body.variantGroupIds;
    }
  } catch {
    return res.status(400).json({ success: false, message: "Invalid packageItems or variantGroupIds JSON" });
  }

  if (packageItems.length > 0) {
    await PackageItems.destroy({ where: { packageId: menu.id } });
    for (const item of packageItems) {
      const existingMenu = await Menu.findByPk(item.itemId);
      if (!existingMenu) {
        return res.status(400).json({
          success: false,
          message: `Invalid package item ID: ${item.itemId}`,
        });
      }
      await PackageItems.create({
        packageId: menu.id,
        packageItemId: item.itemId,
        quantity: item.quantity,
      });
    }
  }

  if (variantGroupIds.length > 0) {
    await MenuVariantGroups.destroy({ where: { menuId: menu.id } });
    for (const variantGroupId of variantGroupIds) {
      await MenuVariantGroups.create({
        menuId: menu.id,
        variantGroupId,
      });
    }
  }

  res.json({ success: true, data: menu });
});

// =============================================
// TOGGLE AVAILABILITY
// =============================================
export const toggleAvailability = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id);
  if (!menu) return res.status(404).json({ success: false, message: "Menu not found" });
  await menu.update({ isAvailable: !menu.isAvailable });
  res.json({ success: true, data: menu });
});

// =============================================
// DELETE MENU
// =============================================
export const deleteMenu = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  const menu = await Menu.findByPk(id);
  if (!menu) {
    return res.status(404).json({ success: false, message: "Menu not found" });
  }

  // -------------------------------
  // Prevent deletion if used in orders
  // -------------------------------
  const existingOrderItems = await OrderItems.findOne({
    where: { menuId: id },
  });

  if (existingOrderItems) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete menu because it already exists in customer orders",
    });
  }

  // -------------------------------
  // Remove package relationships
  // -------------------------------
  await PackageItems.destroy({ where: { packageId: id } });
  await PackageItems.destroy({ where: { packageItemId: id } });

  // -------------------------------
  // Remove variant mappings
  // -------------------------------
  await MenuVariantGroups.destroy({ where: { menuId: id } });

  // -------------------------------
  // Delete image file
  // -------------------------------
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

  // -------------------------------
  // Soft delete (paranoid: true)
  // -------------------------------
  await menu.destroy();

  res.json({ success: true, message: "Menu deleted successfully" });
});