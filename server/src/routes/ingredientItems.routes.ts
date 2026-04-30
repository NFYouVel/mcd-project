import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { addIngredientItem } from "../controllers/ingredientItems.controller.js";

const router: ExpressRouter = Router();

// Add ingredient to a specific order item
router.post("/:orderItemId", addIngredientItem);

export default router;