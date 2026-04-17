import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  payOrder,
  deletePayment,
} from "../controllers/payment.controller.js";

const router: ExpressRouter = Router();

// ✅ CREATE PAYMENT
router.post("/", createPayment);

// ✅ GET ALL
router.get("/", getAllPayments);

// ✅ GET BY ID
router.get("/:id", getPaymentById);

// ✅ UPDATE
router.put("/:id", updatePayment);

// ✅ PAY (custom action)
router.patch("/:id/pay", payOrder);

// ✅ DELETE
router.delete("/:id", deletePayment);

export default router;