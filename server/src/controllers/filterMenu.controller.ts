import { Request, Response } from "express";
import { FilterMenu } from "../models/filterMenu.js";
import { MenuSection } from "../models/menuSection.js";

// Create Filter Menu
export const createFilterMenu = async (req: Request, res: Response) => {
    try {
        const { name, description, section_menu_id } = req.body;

        const section = await MenuSection.findByPk(section_menu_id);
        if (!section) {
            return res.status(400).json({
                message: "Invalid section_menu_id (MenuSection not found)",
            });
        }

        const newFilter = await FilterMenu.create({
            name,
            description,
            section_menu_id,
        });

        return res.status(201).json({
            message: "Filter menu created successfully",
            data: newFilter,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating filter menu",
            error,
        });
    }
};

// Get All FilterMenu (FK MenuSection)
export const getAllFilterMenus = async (req: Request, res: Response) => {
    try {
        const filters = await FilterMenu.findAll({
            include: [
                {
                    model: MenuSection,
                    attributes: ["id", "name"],
                },
            ],
        });

        return res.status(200).json({
            message: "Success",
            data: filters,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching filter menus",
            error,
        });
    }
};

// Get FilterMenu by ID
export const getFilterMenuById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const filter = await FilterMenu.findByPk(id, {
            include: [
                {
                    model: MenuSection,
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!filter) {
            return res.status(404).json({
                message: "Filter menu not found",
            });
        }

        return res.status(200).json({
            message: "Success",
            data: filter,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching filter menu",
            error,
        });
    }
};

// Update Filter Menu
export const updateFilterMenu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, description, section_menu_id } = req.body;

        const filter = await FilterMenu.findByPk(id);

        if (!filter) {
            return res.status(404).json({
                message: "Filter menu not found",
            });
        }

        if (section_menu_id) {
            const section = await MenuSection.findByPk(section_menu_id);
            if (!section) {
                return res.status(400).json({
                    message: "Invalid section_menu_id (MenuSection not found)",
                });
            }
        }

        await filter.update({
            name,
            description,
            section_menu_id,
        });

        return res.status(200).json({
            message: "Filter menu updated successfully",
            data: filter,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating filter menu",
            error,
        });
    }
};

// Delete Filter Menu
export const deleteFilterMenu = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const filter = await FilterMenu.findByPk(id);

        if (!filter) {
            return res.status(404).json({
                message: "Filter menu not found",
            });
        }

        await filter.destroy();

        return res.status(200).json({
            message: "Filter menu deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting filter menu",
            error,
        });
    }
};