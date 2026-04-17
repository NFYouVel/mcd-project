import { Request, Response } from "express";
import { Payment } from "../models/Payment.js";
import { Orders } from "../models/Orders.js";
import { OrderItems } from "../models/OrderItems.js";
import { Menu } from "../models/Menu.js";

// 🔥 helper: calculate total dynamically
const calculateTotal = async (orderId: string) => {
  const items = await OrderItems.findAll({
    where: { orderId },
    include: [{ model: Menu }],
  });

  let total = 0;

  for (const item of items) {
    if (item.menu) {
      total += item.menu.price * item.quantity;
    }
  }

  return total;
};

// ✅ CREATE PAYMENT (usually when checkout)
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, payment_method } = req.body;

    const order = await Orders.findByPk(paymentId);
    if (!order) {
      return res.status(400).json({
        message: "Invalid order (paymentId)",
      });
    }

    const existing = await Payment.findOne({
      where: { paymentId },
    });

    if (existing) {
      return res.status(400).json({
        message: "Payment already exists for this order",
      });
    }

    const total = await calculateTotal(paymentId);

    const payment = await Payment.create({
      paymentId,
      payment_method,
      total_price: total,
      status: "unpaid",
    });

    return res.status(201).json({
      message: "Payment created",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating payment",
      error,
    });
  }
};

// ✅ GET ALL
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Orders }],
    });

    return res.status(200).json({
      message: "Success",
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching payments",
      error,
    });
  }
};

// ✅ GET BY ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const payment = await Payment.findByPk(id, {
      include: [{ model: Orders }],
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching payment",
      error,
    });
  }
};

// ✅ UPDATE (change method or recalc total)
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { payment_method } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const total = await calculateTotal(payment.orderId);

    await payment.update({
      payment_method: payment_method ?? payment.payment_method,
      total_price: total,
    });

    return res.status(200).json({
      message: "Payment updated",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating payment",
      error,
    });
  }
};

// ✅ PAY (mark as paid)
export const payOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (payment.status === "paid") {
      return res.status(400).json({
        message: "Already paid",
      });
    }

    await payment.update({
      status: "paid",
    });

    // 🔥 also update order status
    const order = await Orders.findByPk(payment.orderId);
    if (order) {
      await order.update({
        status: "checkedout",
      });
    }

    return res.status(200).json({
      message: "Payment successful",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error processing payment",
      error,
    });
  }
};

// ✅ DELETE
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    await payment.destroy();

    return res.status(200).json({
      message: "Payment deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting payment",
      error,
    });
  }
};