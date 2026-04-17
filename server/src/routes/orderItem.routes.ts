import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItem.controller.js";

const router: ExpressRouter = Router();

// ✅ CREATE
router.post("/", createOrderItem);

// ✅ GET ALL
router.get("/", getAllOrderItems);

// ✅ GET BY ID
router.get("/:id", getOrderItemById);

// ✅ UPDATE
router.put("/:id", updateOrderItem);

// ✅ DELETE
router.delete("/:id", deleteOrderItem);

export default router;