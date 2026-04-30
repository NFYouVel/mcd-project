import { Router } from "express";
import { addIngredientItem } from "../controllers/ingredientItems.controller.js";

const router = Router();

// Add ingredient to a specific order item
router.post("/:orderItemId", addIngredientItem);

export default router;