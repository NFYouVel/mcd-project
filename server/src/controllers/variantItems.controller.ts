import { Request, Response } from "express";
import { VariantItems } from "../models/VariantItems.js";
import { VariantGroups } from "../models/VariantGroups.js";

// CREATE Variant Item
export const createVariantItem = async (req: Request, res: Response) => {
  try {
    const { name, priceModifier, variantGroupId } = req.body;

    if (!name || priceModifier == null || !variantGroupId) {
      return res.status(400).json({
        message: "name, priceModifier, and variantGroupId are required",
      });
    }

    // check group exists
    const group = await VariantGroups.findByPk(variantGroupId);
    if (!group) {
      return res.status(400).json({
        message: "Variant group not found",
      });
    }

    const item = await VariantItems.create({
      name,
      priceModifier,
      variantGroupId,
    });

    return res.status(201).json({
      message: "Variant item created",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating variant item",
      error,
    });
  }
};

// GET ALL Variant Items
export const getAllVariantItems = async (req: Request, res: Response) => {
  try {
    const items = await VariantItems.findAll({
      include: [
        {
          model: VariantGroups,
          attributes: ["id", "name"],
        },
      ],
      where: {
        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: "Success",
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching variant items",
      error,
    });
  }
};

// GET BY ID
export const getVariantItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await VariantItems.findByPk(id, {
      include: [
        {
          model: VariantGroups,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({
        message: "Variant item not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching variant item",
      error,
    });
  }
};

// UPDATE
export const updateVariantItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, priceModifier, variantGroupId } = req.body;

    const item = await VariantItems.findByPk(id);

    if (!item) {
      return res.status(404).json({
        message: "Variant item not found",
      });
    }

    if (variantGroupId) {
      const group = await VariantGroups.findByPk(variantGroupId);
      if (!group) {
        return res.status(400).json({
          message: "Variant group not found",
        });
      }
    }

    await item.update({
      name: name ?? item.name,
      priceModifier: priceModifier ?? item.priceModifier,
      variantGroupId: variantGroupId ?? item.variantGroupId,
    });

    return res.status(200).json({
      message: "Variant item updated",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating variant item",
      error,
    });
  }
};

// DELETE
export const deleteVariantItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await VariantItems.findByPk(id);

    if (!item) {
      return res.status(404).json({
        message: "Variant item not found",
      });
    }

    await item.destroy();

    return res.status(200).json({
      message: "Variant item deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting variant item",
      error,
    });
  }
};