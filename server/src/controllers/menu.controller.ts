import { Request, Response } from "express";
import { Menu } from "../models/Menu.js";
import { MenuSection } from "../models/MenuSection.js";
import { FilterMenu } from "../models/FilterMenu.js";
import { PackageItems } from "../models/PackageItems.js";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";
import { VariantGroups } from "../models/VariantGroups.js";
import { OrderItems } from "../models/OrderItems.js";


// CREATE MENU
export const createMenu = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      isNew = false,
      isAvailable = true,
      imageUrl,
      isPackage = false,
      filterMenuId,
      packageItems = [],
      variantGroupIds = []
    } = req.body;

    //--------------------------------
    // Validate filter
    //--------------------------------
    if (filterMenuId) {
      const filter = await FilterMenu.findByPk(filterMenuId);

      if (!filter) {
        return res.status(400).json({
          message: "Invalid filterMenuId"
        });
      }
    }

    //--------------------------------
    // Create menu
    //--------------------------------
    const menu = await Menu.create({
      name,
      description,
      price,
      isNew,
      isAvailable,
      imageUrl,
      isPackage,
      filterMenuId
    });

    //--------------------------------
    // Create package items
    //--------------------------------
    if (isPackage && packageItems.length > 0) {
      for (const item of packageItems) {
        const existingMenu = await Menu.findByPk(item.itemId);

        if (!existingMenu) {
          return res.status(400).json({
            message: `Invalid package item ID: ${item.itemId}`
          });
        }

        await PackageItems.create({
          packageId: menu.id,
          packageItemId: item.itemId,
          quantity: item.quantity
        });
      }
    }

    //--------------------------------
    // Create variant groups
    //--------------------------------
    if (variantGroupIds.length > 0) {
      for (const variantGroupId of variantGroupIds) {
        const variantGroup = await VariantGroups.findByPk(
          variantGroupId
        );

        if (!variantGroup) {
          return res.status(400).json({
            message: `Invalid variantGroupId: ${variantGroupId}`
          });
        }

        await MenuVariantGroups.create({
          menuId: menu.id,
          variantGroupId
        });
      }
    }

    return res.status(201).json({
      message: "Menu created successfully",
      data: menu
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating menu",
      error: error.message
    });
  }
};


// GET ALL MENUS
export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.findAll({
      include: [
        {
          model: FilterMenu,
          attributes: ["id", "name"]
        },
        {
          model: PackageItems,
          as: "packages"
        },
        {
          model: MenuVariantGroups
        }
      ]
    });

    return res.status(200).json({
      message: "Success",
      data: menus
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching menus",
      error
    });
  }
};


// GET MENU BY ID
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const menu = await Menu.findByPk(id, {
      include: [
        {
          model: FilterMenu
        },
        {
          model: PackageItems,
          as: "packages"
        },
        {
          model: MenuVariantGroups
        }
      ]
    });

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found"
      });
    }

    return res.status(200).json({
      message: "Success",
      data: menu
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching menu",
      error
    });
  }
};


// UPDATE MENU
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const {
      name,
      description,
      price,
      isNew,
      isAvailable,
      imageUrl,
      isPackage,
      filterMenuId,
      packageItems = [],
      variantGroupIds = []
    } = req.body;

    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found"
      });
    }

    //--------------------------------
    // Validate filter
    //--------------------------------
    if (filterMenuId) {
      const filter = await FilterMenu.findByPk(filterMenuId);

      if (!filter) {
        return res.status(400).json({
          message: "Invalid filterMenuId"
        });
      }
    }

    //--------------------------------
    // Update menu
    //--------------------------------
    await menu.update({
      name,
      description,
      price,
      isNew,
      isAvailable,
      imageUrl,
      isPackage,
      filterMenuId
    });

    //--------------------------------
    // Update package items
    //--------------------------------
    if (packageItems.length > 0) {
      await PackageItems.destroy({
        where: {
          packageId: menu.id
        }
      });

      for (const item of packageItems) {
        const existingMenu = await Menu.findByPk(item.itemId);

        if (!existingMenu) {
          return res.status(400).json({
            message: `Invalid package item ID: ${item.itemId}`
          });
        }

        await PackageItems.create({
          packageId: menu.id,
          packageItemId: item.itemId,
          quantity: item.quantity
        });
      }
    }

    //--------------------------------
    // Update variant groups
    //--------------------------------
    if (variantGroupIds.length > 0) {
      await MenuVariantGroups.destroy({
        where: {
          menuId: menu.id
        }
      });

      for (const variantGroupId of variantGroupIds) {
        const variantGroup = await VariantGroups.findByPk(
          variantGroupId
        );

        if (!variantGroup) {
          return res.status(400).json({
            message: `Invalid variantGroupId: ${variantGroupId}`
          });
        }

        await MenuVariantGroups.create({
          menuId: menu.id,
          variantGroupId
        });
      }
    }

    return res.status(200).json({
      message: "Menu updated successfully",
      data: menu
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error updating menu",
      error
    });
  }
};


// DELETE MENU
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found"
      });
    }

    //--------------------------------
    // Prevent deletion if used in orders
    //--------------------------------
    const existingOrderItems = await OrderItems.findOne({
      where: {
        menuId: id
      }
    });

    if (existingOrderItems) {
      return res.status(400).json({
        message:
          "Cannot delete menu because it already exists in customer orders"
      });
    }

    //--------------------------------
    // Remove package relationships
    //--------------------------------
    await PackageItems.destroy({
      where: {
        packageId: id
      }
    });

    await PackageItems.destroy({
      where: {
        packageItemId: id
      }
    });

    //--------------------------------
    // Remove variant mappings
    //--------------------------------
    await MenuVariantGroups.destroy({
      where: {
        menuId: id
      }
    });

    //--------------------------------
    // Delete menu
    //--------------------------------
    await menu.destroy();

    return res.status(200).json({
      message: "Menu deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting menu",
      error
    });
  }
};