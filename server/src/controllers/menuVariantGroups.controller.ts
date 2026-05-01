import { Request, Response } from "express";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";
import { Menu } from "../models/Menu.js";
import { VariantGroups } from "../models/VariantGroups.js";

// ADD relation (Menu ↔ VariantGroup)
export const addMenuVariantGroup = async (req: Request, res: Response) => {
  try {
    const { menuId, variantGroupId } = req.body;

    if (!menuId || !variantGroupId) {
      return res.status(400).json({
        message: "menuId and variantGroupId are required",
      });
    }

    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(400).json({
        message: "Menu not found",
      });
    }

    const group = await VariantGroups.findByPk(variantGroupId);
    if (!group) {
      return res.status(400).json({
        message: "Variant group not found",
      });
    }

    // prevent duplicate mapping
    const existing = await MenuVariantGroups.findOne({
      where: { menuId, variantGroupId },
    });

    if (existing) {
      return res.status(400).json({
        message: "Relation already exists",
      });
    }

    const data = await MenuVariantGroups.create({
      menuId,
      variantGroupId,
    });

    return res.status(201).json({
      message: "Menu variant group linked",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating relation",
      error,
    });
  }
};

// GET ALL relations
export const getAllMenuVariantGroups = async (req: Request, res: Response) => {
  try {
    const data = await MenuVariantGroups.findAll({
      include: [
        {
          model: Menu,
          attributes: ["id", "name", "price"],
        },
        {
          model: VariantGroups,
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching relations",
      error,
    });
  }
};

// DELETE relation
export const deleteMenuVariantGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const relation = await MenuVariantGroups.findByPk(id);

    if (!relation) {
      return res.status(404).json({
        message: "Relation not found",
      });
    }

    await relation.destroy();

    return res.status(200).json({
      message: "Relation deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting relation",
      error,
    });
  }
};