import { MenuSection } from "../models/MenuSection.js";
import { Type } from "../models/Type.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";

export const getAllSections = async (req: any, res: any) => {
  try {
    const { typeId } = req.query;

    const where: any = {};
    if (typeId && typeof typeId === "string") {
      where.typeId = typeId;
    }

    const sections = await MenuSection.findAll({
      where,
      include: [
        { model: Type },
        { model: FilterMenu },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      success: true,
      data: sections,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching sections",
      error,
    });
  }
};

export const getSectionById = async (req: any, res: any) => {
  try {
    const id = getIdParam(req);

    const section = await MenuSection.findByPk(id, {
      include: [Type, FilterMenu],
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.json({
      success: true,
      data: section,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching section",
      error,
    });
  }
};

export const createSection = async (req: any, res: any) => {
  try {
    const { name, description, typeId } = req.body;

    if (!name || !typeId) {
      return res.status(400).json({
        success: false,
        message: "name & typeId required",
      });
    }

    // 🔥 validate type exists
    const type = await Type.findByPk(typeId);
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Invalid typeId",
      });
    }

    const section = await MenuSection.create({
      name,
      description,
      typeId,
    });

    return res.status(201).json({
      success: true,
      data: section,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creating section",
      error,
    });
  }
};

export const updateSection = async (req: any, res: any) => {
  try {
    const id = getIdParam(req);

    const section = await MenuSection.findByPk(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const { name, description, typeId } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (typeId !== undefined) {
      const type = await Type.findByPk(typeId);
      if (!type) {
        return res.status(400).json({
          success: false,
          message: "Invalid typeId",
        });
      }
      updateData.typeId = typeId;
    }

    await section.update(updateData);

    return res.json({
      success: true,
      data: section,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error updating section",
      error,
    });
  }
};

export const deleteSection = async (req: any, res: any) => {
  try {
    const id = getIdParam(req);

    const section = await MenuSection.findByPk(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await section.destroy();

    return res.json({
      success: true,
      message: "Section deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting section",
      error,
    });
  }
};