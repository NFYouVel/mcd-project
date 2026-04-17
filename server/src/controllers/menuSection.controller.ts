import { Request, Response } from "express";
import {MenuSection} from "../models/MenuSection.js";
import {Type} from "../models/Type.js";

//CREATE Menu Section
export const createMenuSection = async (req: Request, res: Response) => {
  try {
    const { name, description, type_id } = req.body;

    // 🔥 validate FK
    const type = await Type.findByPk(type_id);
    if (!type) {
      return res.status(400).json({
        message: "Invalid type_id (Type not found)",
      });
    }

    const newSection = await MenuSection.create({
      name,
      description,
      type_id,
    });

    return res.status(201).json({
      message: "Menu section created successfully",
      data: newSection,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating menu section",
      error,
    });
  }
};

//Get All Menu Sections (with type id)
export const getAllMenuSections = async (req: Request, res: Response) => {
  try {
    const sections = await MenuSection.findAll({
      include: [
        {
          model: Type,
          attributes: ["id", "food_type_id", "description"],
        },
      ],
    });

    return res.status(200).json({
      message: "Success",
      data: sections,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching menu sections",
      error,
    });
  }
};

//Get Menu Section by ID
export const getMenuSectionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const section = await MenuSection.findByPk(id, {
      include: [
        {
          model: Type,
          attributes: ["id", "food_type_id", "description"],
        },
      ],
    });

    if (!section) {
      return res.status(404).json({
        message: "Menu section not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: section,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching menu section",
      error,
    });
  }
};

//Update Menu Section
export const updateMenuSection = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, type_id } = req.body;

    const section = await MenuSection.findByPk(id);

    if (!section) {
      return res.status(404).json({
        message: "Menu section not found",
      });
    }

    //check FK
    if (type_id) {
      const type = await Type.findByPk(type_id);
      if (!type) {
        return res.status(400).json({
          message: "Invalid type_id (Type not found)",
        });
      }
    }

    await section.update({
      name,
      description,
      type_id,
    });

    return res.status(200).json({
      message: "Menu section updated successfully",
      data: section,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating menu section",
      error,
    });
  }
};

//Delete Menu Section
export const deleteMenuSection = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const section = await MenuSection.findByPk(id);

    if (!section) {
      return res.status(404).json({
        message: "Menu section not found",
      });
    }

    await section.destroy();

    return res.status(200).json({
      message: "Menu section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting menu section",
      error,
    });
  }
};