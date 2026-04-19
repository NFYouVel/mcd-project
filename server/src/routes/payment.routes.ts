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

//Create Payment
router.post("/", createPayment);

//Get All Payments
router.get("/", getAllPayments);

//Get Payment by ID
router.get("/:id", getPaymentById);

//Update Payment
router.put("/:id", updatePayment);

//PAY (custom action)
router.patch("/:id/pay", payOrder);

//Delete Payment
router.delete("/:id", deletePayment);

export default router;