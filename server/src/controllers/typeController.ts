import { Request, Response } from "express";
import { Type } from "../models/Type.js";

//Create Type
export const createType = async (req: Request, res: Response) => {
  try {
    const { food_type_id, description } = req.body;

    const newType = await Type.create({
      food_type_id,
      description,
    });

    return res.status(201).json({
      message: "Type created successfully",
      data: newType,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating type",
      error,
    });
  }
};

//GET ALL types
export const getAllTypes = async (req: Request, res: Response) => {
  try {
    const types = await Type.findAll();

    return res.status(200).json({
      message: "Success",
      data: types,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching types",
      error,
    });
  }
};

//Get type by ID
export const getTypeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).json({
        message: "Type not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: type,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching type",
      error,
    });
  }
};

// ✅ UPDATE Type
export const updateType = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { food_type_id, description } = req.body;

    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).json({
        message: "Type not found",
      });
    }

    await type.update({
      food_type_id,
      description,
    });

    return res.status(200).json({
      message: "Type updated successfully",
      data: type,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating type",
      error,
    });
  }
};

// ✅ DELETE Type (soft delete because paranoid = true)
export const deleteType = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).json({
        message: "Type not found",
      });
    }

    await type.destroy();

    return res.status(200).json({
      message: "Type deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting type",
      error,
    });
  }
};