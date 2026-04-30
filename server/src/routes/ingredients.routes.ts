import { Router } from "express";
import {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredients.controller.js";

const router = Router();

// CREATE
router.post("/", createIngredient);

// READ ALL
router.get("/", getAllIngredients);

// READ ONE
router.get("/:id", getIngredientById);

// UPDATE
router.put("/:id", updateIngredient);

// DELETE
router.delete("/:id", deleteIngredient);

export default router;