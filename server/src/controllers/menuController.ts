import { Request, Response } from "express";
import { Menu } from "../models/Menu.js";
import { MenuSection } from "../models/MenuSection.js";
import { FilterMenu } from "../models/FilterMenu.js";

// ✅ CREATE MENU
export const createMenu = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      section_menu_id,
      filter_menu_id,
    } = req.body;

    // 🔥 validate MenuSection
    const section = await MenuSection.findByPk(section_menu_id);
    if (!section) {
      return res.status(400).json({
        message: "Invalid section_menu_id",
      });
    }

    // 🔥 validate FilterMenu (optional depending on your design)
    if (filter_menu_id) {
      const filter = await FilterMenu.findByPk(filter_menu_id);
      if (!filter) {
        return res.status(400).json({
          message: "Invalid filter_menu_id",
        });
      }
    }

    const newMenu = await Menu.create({
      name,
      description,
      price,
      section_menu_id,
      filter_menu_id,
    });

    return res.status(201).json({
      message: "Menu created successfully",
      data: newMenu,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating menu",
      error,
    });
  }
};

// ✅ GET ALL MENUS (WITH RELATIONS)
export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.findAll({
      include: [
        {
          model: MenuSection,
          attributes: ["id", "name"],
        },
        {
          model: FilterMenu,
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({
      message: "Success",
      data: menus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching menus",
      error,
    });
  }
};

// ✅ GET MENU BY ID
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const menu = await Menu.findByPk(id, {
      include: [
        {
          model: MenuSection,
          attributes: ["id", "name"],
        },
        {
          model: FilterMenu,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: menu,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching menu",
      error,
    });
  }
};

// ✅ UPDATE MENU
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      name,
      description,
      price,
      section_menu_id,
      filter_menu_id,
    } = req.body;

    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    // 🔥 validate section if updated
    if (section_menu_id) {
      const section = await MenuSection.findByPk(section_menu_id);
      if (!section) {
        return res.status(400).json({
          message: "Invalid section_menu_id",
        });
      }
    }

    // 🔥 validate filter if updated
    if (filter_menu_id) {
      const filter = await FilterMenu.findByPk(filter_menu_id);
      if (!filter) {
        return res.status(400).json({
          message: "Invalid filter_menu_id",
        });
      }
    }

    await menu.update({
      name,
      description,
      price,
      section_menu_id,
      filter_menu_id,
    });

    return res.status(200).json({
      message: "Menu updated successfully",
      data: menu,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating menu",
      error,
    });
  }
};

// ✅ DELETE MENU
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    await menu.destroy();

    return res.status(200).json({
      message: "Menu deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting menu",
      error,
    });
  }
};