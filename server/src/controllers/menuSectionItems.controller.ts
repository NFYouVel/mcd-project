import { Request, Response } from "express";
import { SectionMenuItems } from "../models/SectionMenuItems.js";
import { Menu } from "../models/Menu.js";
import { MenuSection } from "../models/MenuSection.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";

// =============================================
// CREATE (link menu ↔ section)
// =============================================
export const createSectionMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const { menuId, sectionMenuId } = req.body;

  if (!menuId || !sectionMenuId) {
    return res.status(400).json({
      success: false,
      message: "menuId and sectionMenuId are required",
    });
  }

  // ✅ validate existence
  const menu = await Menu.findByPk(menuId);
  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found",
    });
  }

  const section = await MenuSection.findByPk(sectionMenuId);
  if (!section) {
    return res.status(404).json({
      success: false,
      message: "MenuSection not found",
    });
  }

  // 🚫 prevent duplicate
  const existing = await SectionMenuItems.findOne({
    where: { menuId, sectionMenuId },
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Relation already exists",
    });
  }

  const created = await SectionMenuItems.create({
    menuId,
    sectionMenuId,
  });

  res.status(201).json({
    success: true,
    message: "Menu linked to section",
    data: created,
  });
});

// =============================================
// GET ALL RELATIONS
// =============================================
export const getAllSectionMenuItems = asyncHandler(async (_req: Request, res: Response) => {
  const data = await SectionMenuItems.findAll({
    include: [
      {
        model: Menu,
        attributes: ["id", "name"],
      },
      {
        model: MenuSection,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    data,
  });
});

// =============================================
// GET MENUS BY SECTION
// =============================================
export const getMenusBySection = asyncHandler(async (req: Request, res: Response) => {
  const { sectionMenuId } = req.params;

  const data = await SectionMenuItems.findAll({
    where: { sectionMenuId },
    include: [
      {
        model: Menu,
        attributes: ["id", "name", "price", "imageUrl"],
      },
    ],
  });

  res.json({
    success: true,
    data,
  });
});

// =============================================
// GET SECTIONS BY MENU
// =============================================
export const getSectionsByMenu = asyncHandler(async (req: Request, res: Response) => {
  const { menuId } = req.params;

  const data = await SectionMenuItems.findAll({
    where: { menuId },
    include: [
      {
        model: MenuSection,
        attributes: ["id", "name"],
      },
    ],
  });

  res.json({
    success: true,
    data,
  });
});

// =============================================
// DELETE (unlink)
// =============================================
export const deleteSectionMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);

  const item = await SectionMenuItems.findByPk(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Relation not found",
    });
  }

  await item.destroy();

  res.json({
    success: true,
    message: "Relation deleted",
  });
});