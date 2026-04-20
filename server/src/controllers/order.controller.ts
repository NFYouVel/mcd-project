import { Request, Response } from "express";
import { Orders } from "../models/orders.js";
import { Users } from "../models/Users.js";
import { OrderItems } from "../models/OrderItems.js";
import { Menu } from "../models/menu.js";
import model from "sequelize/lib/model";

//Create Order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await Orders.create({
      total_price: 0, // starts with 0
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

//Get All Orders (FK OrdersItems -> Menu)
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

//Update Order
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

//Delete Order
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