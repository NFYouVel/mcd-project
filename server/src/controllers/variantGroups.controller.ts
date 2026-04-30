import { Request, Response } from "express";
import { VariantGroups } from "../models/VariantGroups.js";

// CREATE Variant Group
export const createVariantGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const group = await VariantGroups.create({
      name,
    });

    return res.status(201).json({
      message: "Variant group created",
      data: group,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating variant group",
      error,
    });
  }
};

// GET ALL Variant Groups
export const getAllVariantGroups = async (req: Request, res: Response) => {
  try {
    const groups = await VariantGroups.findAll({
      where: {
        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: "Success",
      data: groups,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching variant groups",
      error,
    });
  }
};

// GET by ID
export const getVariantGroupById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const group = await VariantGroups.findByPk(id);

    if (!group) {
      return res.status(404).json({
        message: "Variant group not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: group,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching variant group",
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
      return res.status(404).json({
        message: "Variant group not found",
      });
    }

    await group.update({
      name: name ?? group.name,
    });

    return res.status(200).json({
      message: "Variant group updated",
      data: group,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating variant group",
      error,
    });
  }
};

// DELETE
export const deleteVariantGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const group = await VariantGroups.findByPk(id);

    if (!group) {
      return res.status(404).json({
        message: "Variant group not found",
      });
    }

    await group.destroy();

    return res.status(200).json({
      message: "Variant group deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting variant group",
      error,
    });
  }
};