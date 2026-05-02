import { Request, Response } from "express";
import { FilterMenu } from "../models/FilterMenu.js";
import { MenuSection } from "../models/MenuSection.js";
import { Menu } from "../models/Menu.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";


// =============================================
// GET ALL FILTER MENUS
// =============================================
export const getAllFilterMenus = asyncHandler(async (req: Request, res: Response) => {
  const data = await FilterMenu.findAll({
    include: [
      {
        model: MenuSection,
        through: { attributes: [] }, // hide junction
      },
      {
        model: Menu,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({ success: true, data });
});


// =============================================
// GET BY ID
// =============================================
export const getFilterMenuById = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);

  const data = await FilterMenu.findByPk(id, {
    include: [
      {
        model: MenuSection,
        through: { attributes: [] },
      },
      {
        model: Menu,
        attributes: ["id", "name"],
      },
    ],
  });

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "FilterMenu not found",
    });
  }

  res.json({ success: true, data });
});


// =============================================
// CREATE FILTER MENU
// =============================================
export const createFilterMenu = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, sectionIds = [] } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  // 🔥 validate sections
  if (sectionIds.length > 0) {
    const sections = await MenuSection.findAll({
      where: { id: sectionIds },
    });

    if (sections.length !== sectionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid sectionIds",
      });
    }
  }

  const filter = await FilterMenu.create({
    name,
    description,
  });

  // 🔥 set M:N relation
  if (sectionIds.length > 0) {
    await filter.$set("menuSections", sectionIds);
  }

  res.status(201).json({
    success: true,
    data: filter,
  });
});


// =============================================
// UPDATE FILTER MENU
// =============================================
export const updateFilterMenu = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);

  const filter = await FilterMenu.findByPk(id);
  if (!filter) {
    return res.status(404).json({
      success: false,
      message: "FilterMenu not found",
    });
  }

  const { name, description, sectionIds } = req.body;

  // 🔥 validate sections
  if (sectionIds) {
    const sections = await MenuSection.findAll({
      where: { id: sectionIds },
    });

    if (sections.length !== sectionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid sectionIds",
      });
    }

    // replace relations
    await filter.$set("menuSections", sectionIds);
  }

  await filter.update({
    name: name ?? filter.name,
    description: description ?? filter.description,
  });

  res.json({
    success: true,
    data: filter,
  });
});


// =============================================
// DELETE FILTER MENU
// =============================================
export const deleteFilterMenu = asyncHandler(async (req: Request, res: Response) => {
  const id = getIdParam(req);

  const filter = await FilterMenu.findByPk(id);
  if (!filter) {
    return res.status(404).json({
      success: false,
      message: "FilterMenu not found",
    });
  }

  // optional: detach sections first (cleaner)
  await filter.$set("menuSections", []);

  await filter.destroy();

  res.json({
    success: true,
    message: "FilterMenu deleted",
  });
});