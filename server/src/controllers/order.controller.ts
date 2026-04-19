import { Request, Response } from "express";
import { Orders } from "../models/Orders.js";
import { Users } from "../models/Users.js";
import { OrderItems } from "../models/OrderItems.js";
import { Menu } from "../models/Menu.js";
import model from "sequelize/lib/model";

// ✅ CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await Orders.create({
      total_price: 0, // start with 0
    });

    return res.status(201).json({
      message: "Order created",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating order",
      error,
    });
  }
};

// ✅ GET ALL ORDERS
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Orders.findAll({
      include: [
    {
      model: OrderItems,
      as: "orderItems",
      include: [
            {
              model: Menu,
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Success",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching orders",
      error,
    });
  }
};

// ✅ GET ORDER BY ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await Orders.findByPk(id, {
      include: [
        {
          model: Users,
          attributes: ["id", "name"],
        },
        {
          model: OrderItems,
          include: [
            {
              model: Menu,
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching order",
      error,
    });  
  }
};

// ✅ UPDATE ORDER (optional: status etc.)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.update({
      status,
    });

    return res.status(200).json({
      message: "Order updated",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating order",
      error,
    });
  }
};

// ✅ DELETE ORDER
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.destroy();

    return res.status(200).json({
      message: "Order deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting order",
      error,
    });
  }
};