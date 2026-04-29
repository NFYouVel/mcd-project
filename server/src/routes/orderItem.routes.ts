import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItem.controller.js";

import { addIngredientItem } from "../controllers/ingredientItems.controller.js";

const router: ExpressRouter = Router();

//Add Ingredient Item
router.post("/:orderItemId/ingredients", addIngredientItem);

//Create OrderItem
router.post("/", createOrderItem);

//Get All OrderItems
router.get("/", getAllOrderItems);

//Get OrderItem by ID
router.get("/:id", getOrderItemById);

//Update OrderItem
router.put("/:id", updateOrderItem);

//Delete OrderItem
router.delete("/:id", deleteOrderItem);

export default router;