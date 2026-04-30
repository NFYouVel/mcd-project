import { Request, Response } from "express";
import { Ingredients } from "../models/Ingredients.js";

// CREATE Ingredient
export const createIngredient = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const ingredient = await Ingredients.create({
      name,
      price,
    });

    return res.status(201).json({
      message: "Ingredient created",
      data: ingredient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating ingredient",
      error,
    });
  }
};

// GET ALL Ingredients
export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await Ingredients.findAll({
      where: {
        deletedAt: null, // if paranoid is NOT enabled
      },
    });

    return res.status(200).json({
      message: "Success",
      data: ingredients,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching ingredients",
      error,
    });
  }
};

// GET Ingredient by ID
export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredients.findByPk(id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: ingredient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching ingredient",
      error,
    });
  }
};

// UPDATE Ingredient
export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const ingredient = await Ingredients.findByPk(id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    await ingredient.update({
      name: name ?? ingredient.name,
      price: price ?? ingredient.price,
    });

    return res.status(200).json({
      message: "Ingredient updated",
      data: ingredient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating ingredient",
      error,
    });
  }
};

// DELETE Ingredient (soft delete if paranoid enabled)
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredients.findByPk(id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    await ingredient.destroy();

    return res.status(200).json({
      message: "Ingredient deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting ingredient",
      error,
    });
  }
};