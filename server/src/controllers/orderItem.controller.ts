import { Request, Response } from "express";
import { OrderItems } from "../models/OrderItems.js";
import { Orders } from "../models/Orders.js";
import { Menu } from "../models/Menu.js";
import { Payment } from "../models/Payment.js";
import { calculateTotal } from "../utils/calculateTotal.js";
import { syncPayment } from "../utils/syncPayment.js";

//Create Order Item
export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderId, menuId, quantity } = req.body;

    const order = await Orders.findByPk(orderId);
    if (!order) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order already processed",
      });
    }

    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(400).json({ message: "Invalid menuId" });
    }

    const item = await OrderItems.create({
      orderId,
      menuId,
      quantity,
    });

    const total = await syncPayment(orderId);

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

//Get All Order Items
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

//Get Order Item by ID
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

//Update Order Item
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

    const order = await Orders.findByPk(item.orderId);
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

    await item.update({
      quantity,
    });

    const total = await syncPayment(item.orderId);

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

//Delete Order Item
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await OrderItems.findByPk(id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const order = await Orders.findByPk(item.orderId);

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

    const orderId = item.orderId;

    await item.destroy();

    const total = await syncPayment(orderId);

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