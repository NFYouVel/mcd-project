import { Request, Response } from "express";
import { PackageItems } from "../models/PackageItems.js";
import { Menu } from "../models/Menu.js";


// CREATE PACKAGE ITEM
export const createPackageItem = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      packageId,
      packageItemId,
      quantity
    } = req.body;

    //--------------------------------
    // Validate package menu
    //--------------------------------
    const packageMenu = await Menu.findByPk(packageId);

    if (!packageMenu) {
      return res.status(400).json({
        message: "Invalid packageId"
      });
    }

    if (!packageMenu.isPackage) {
      return res.status(400).json({
        message: "Selected menu is not a package"
      });
    }

    //--------------------------------
    // Validate item menu
    //--------------------------------
    const itemMenu = await Menu.findByPk(packageItemId);

    if (!itemMenu) {
      return res.status(400).json({
        message: "Invalid packageItemId"
      });
    }

    //--------------------------------
    // Prevent nested packages
    //--------------------------------
    if (itemMenu.isPackage) {
      return res.status(400).json({
        message: "Cannot add package inside another package"
      });
    }

    //--------------------------------
    // Prevent duplicate package item
    //--------------------------------
    const existingItem = await PackageItems.findOne({
      where: {
        packageId,
        packageItemId
      }
    });

    if (existingItem) {
      return res.status(400).json({
        message: "This item already exists in package"
      });
    }

    const packageItem = await PackageItems.create({
      packageId,
      packageItemId,
      quantity
    });

    return res.status(201).json({
      message: "Package item created successfully",
      data: packageItem
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creating package item",
      error
    });
  }
};



// GET ALL PACKAGE ITEMS
export const getAllPackageItems = async (
  req: Request,
  res: Response
) => {
  try {
    const packageItems = await PackageItems.findAll({
      include: [
        {
          model: Menu,
          as: "package",
          attributes: [
            "id",
            "name",
            "price",
            "isPackage"
          ]
        },
        {
          model: Menu,
          as: "packageItem",
          attributes: [
            "id",
            "name",
            "price"
          ]
        }
      ]
    });

    return res.status(200).json({
      message: "Success",
      data: packageItems
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching package items",
      error
    });
  }
};



// GET PACKAGE CONTENTS BY PACKAGE ID
export const getPackageItemsByPackageId = async (
  req: Request,
  res: Response
) => {
  try {
    const packageId = req.params.packageId;

    const packageItems = await PackageItems.findAll({
      where: {
        packageId
      },
      include: [
        {
          model: Menu,
          as: "package",
          attributes: [
            "id",
            "name"
          ]
        },
        {
          model: Menu,
          as: "packageItem",
          attributes: [
            "id",
            "name",
            "price"
          ]
        }
      ]
    });

    if (packageItems.length === 0) {
      return res.status(404).json({
        message: "Package has no items"
      });
    }

    return res.status(200).json({
      message: "Success",
      data: packageItems
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching package contents",
      error
    });
  }
};



// UPDATE PACKAGE ITEM
export const updatePackageItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;
    const { quantity } = req.body;

    const packageItem = await PackageItems.findByPk(id);

    if (!packageItem) {
      return res.status(404).json({
        message: "Package item not found"
      });
    }

    await packageItem.update({
      quantity
    });

    return res.status(200).json({
      message: "Package item updated successfully",
      data: packageItem
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error updating package item",
      error
    });
  }
};



// DELETE PACKAGE ITEM
export const deletePackageItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const packageItem = await PackageItems.findByPk(id);

    if (!packageItem) {
      return res.status(404).json({
        message: "Package item not found"
      });
    }

    await packageItem.destroy();

    return res.status(200).json({
      message: "Package item deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting package item",
      error
    });
  }
};