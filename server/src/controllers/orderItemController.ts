import { Request, Response } from "express";
import { OrderItem } from "../models/OrderItems.js";
import { Orders } from "../models/Orders.js";
import { Menu } from "../models/Menu.js";
import { Payment } from "../models/Payment.js";

// 🔥 helper: calculate total
const calculateTotal = async (order_id: string) => {
  const items = await OrderItem.findAll({
    where: { order_id },
  });

  let total = 0;
  for (const item of items) {
    total += Number(item.subtotal);
  }

  return total;
};

// 🔥 helper: sync payment total if exists
const syncPayment = async (order_id: string) => {
  const payment = await Payment.findOne({
    where: { order_id },
  });

  if (!payment) return null;

  const total = await calculateTotal(order_id);

  await payment.update({
    total_price: total,
  });

  return total;
};

// ✅ CREATE
export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { order_id, menu_id, quantity } = req.body;

    const order = await Orders.findByPk(order_id);
    if (!order) {
      return res.status(400).json({ message: "Invalid order_id" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order already processed",
      });
    }

    const menu = await Menu.findByPk(menu_id);
    if (!menu) {
      return res.status(400).json({ message: "Invalid menu_id" });
    }

    const subtotal = Number(menu.price) * quantity;

    const item = await OrderItems.create({
      order_id,
      menu_id,
      quantity,
      subtotal,
    });

    const total = await syncPayment(order_id);

    return res.status(201).json({
      message: "Item added",
      data: item,
      payment_total: total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating item",
      error,
    });
  }
};

// ✅ GET ALL
export const getAllOrderItems = async (req: Request, res: Response) => {
  try {
    const items = await OrderItems.findAll({
      include: [
        { model: Orders },
        { model: Menu, attributes: ["id", "name", "price"] },
      ],
    });

    return res.status(200).json({
      message: "Success",
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching items",
      error,
    });
  }
};

// ✅ GET BY ID
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await OrderItems.findByPk(id, {
      include: [
        { model: Orders },
        { model: Menu, attributes: ["id", "name", "price"] },
      ],
    });

    if (!item) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching item",
      error,
    });
  }
};

// ✅ UPDATE
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { quantity } = req.body;

    const item = await OrderItems.findByPk(id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const order = await Orders.findByPk(item.order_id);
    const menu = await Menu.findByPk(item.menu_id);

    if (!order || !menu) {
      return res.status(400).json({
        message: "Related data missing",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order already processed",
      });
    }

    const newSubtotal = Number(menu.price) * quantity;

    await item.update({
      quantity,
      subtotal: newSubtotal,
    });

    const total = await syncPayment(item.order_id);

    return res.status(200).json({
      message: "Item updated",
      data: item,
      payment_total: total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating item",
      error,
    });
  }
};

// ✅ DELETE
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await OrderItems.findByPk(id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const order = await Orders.findByPk(item.order_id);

    if (!order) {
      return res.status(400).json({
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order already processed",
      });
    }

    const order_id = item.order_id;

    await item.destroy();

    const total = await syncPayment(order_id);

    return res.status(200).json({
      message: "Item deleted",
      payment_total: total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting item",
      error,
    });
  }
};