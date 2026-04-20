import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createOrder,
  getAllOrders,
  // getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

const router: ExpressRouter = Router();

//Create Order
router.post("/", createOrder);

//Get All Orders
router.get("/", getAllOrders);

//Update Order
router.put("/:id", updateOrder);

//Delete Order
router.delete("/:id", deleteOrder);

export default router;