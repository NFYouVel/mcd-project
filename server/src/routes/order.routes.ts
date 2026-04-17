import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

const router: ExpressRouter = Router();

// ✅ CREATE ORDER
router.post("/", createOrder);

// ✅ GET ALL
router.get("/", getAllOrders);

// ✅ GET BY ID
router.get("/:id", getOrderById);

// ✅ UPDATE (status, etc.)
router.put("/:id", updateOrder);

// ✅ DELETE
router.delete("/:id", deleteOrder);

export default router;