import { Request, Response } from "express";
import { VariantGroups } from "../models/VariantGroups.js";
import { VariantItems } from "../models/VariantItems.js";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";

// CREATE
export const createVariantGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const group = await VariantGroups.create({ name });

    return res.status(201).json({
      message: "Variant group created",
      data: group,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating variant group", error });
  }
};

// GET ALL
export const getAllVariantGroups = async (req: Request, res: Response) => {
  try {
    const groups = await VariantGroups.findAll({
      include: [
        {
          model: VariantItems,
          as: "variantItems",
        },
      ],
    });

    return res.status(200).json({ message: "Success", data: groups });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching variant groups", error });
  }
};

// GET BY ID
export const getVariantGroupById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const group = await VariantGroups.findByPk(id, {
      include: [{ model: VariantItems, as: "variantItems" }],
    });

    if (!group) {
      return res.status(404).json({ message: "Variant group not found" });
    }

    return res.status(200).json({ message: "Success", data: group });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching variant group", error });
  }
};

// GET ALL VARIANT GROUPS FOR A SPECIFIC MENU
// Route: GET /variantgroup/menu/:menuId
export const getAllVariantGroupsByMenu = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;

    // Find all MenuVariantGroups rows for this menu,
    // then include the VariantGroup and its VariantItems
    const menuVariantGroups = await MenuVariantGroups.findAll({
      where: { menuId },
      include: [
        {
          model: VariantGroups,
          as: "variantGroup",
          include: [
            {
              model: VariantItems,
              as: "variantItems",
            },
          ],
        },
      ],
    });

    // Unwrap to just the variant group objects
    const groups = menuVariantGroups
      .map((mvg: any) => mvg.variantGroup)
      .filter(Boolean);

    return res.status(200).json({ message: "Success", data: groups });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching variant groups for menu",
      error,
    });
  }
};


// UPDATE
export const updateVariantGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;

    const group = await VariantGroups.findByPk(id);

    if (!group) {
      return res.status(404).json({ message: "Variant group not found" });
    }

    await group.update({ name: name ?? group.name });

    return res.status(200).json({ message: "Variant group updated", data: group });
  } catch (error) {
    return res.status(500).json({ message: "Error updating variant group", error });
  }
};

// DELETE
export const deleteVariantGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const group = await VariantGroups.findByPk(id);

    if (!group) {
      return res.status(404).json({ message: "Variant group not found" });
    }

    await group.destroy();

    return res.status(200).json({ message: "Variant group deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting variant group", error });
  }
};