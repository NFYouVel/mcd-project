import { Request, Response } from "express";
import { Orders } from "../models/Orders.js";
import { Users } from "../models/Users.js";
import { OrderItems } from "../models/OrderItems.js";
import { Menu } from "../models/Menu.js";
import model from "sequelize/lib/model";
import { Ingredients } from "../models/Ingredients.js";
import { IngredientItems } from "../models/IngredientItems.js";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";
import { VariantGroups } from "../models/VariantGroups.js";
import { VariantItems } from "../models/VariantItems.js";
import { sequelize } from "../config/database.js"; // sesuaikan path sequelize instance lo


//Create Order
// server/src/controllers/order.controller.ts
export const createOrder = async (req: any, res: any) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "orderItems required" });
    }

    // 1. Create order
    const order = await Orders.create(
      { status: "pending" }
    );

    // 2. Create order items
    for (const item of orderItems) {
      const orderItem = await OrderItems.create(
        {
          menuId: item.menuId,
          orderId: order.id,
          variantItemsId: item.variantItemsId || null, // ← INI BARU
          status: "pending",
        }
      );

      // 3. Create ingredient items if any
      if (item.ingredientItems && Array.isArray(item.ingredientItems)) {
        const ingredients = item.ingredientItems.map((ing: any) => ({
          ingredientsId: ing.ingredientsId,
          orderItemsId: orderItem.id,
          quantity: ing.quantity,
          price: ing.price,
        }));
        await IngredientItems.bulkCreate(ingredients);
      }
    }

    // Re-fetch with relations
    const result = await Orders.findByPk(order.id, {
      include: [
        {
          model: OrderItems,
          include: [
            { model: Menu, attributes: ["id", "name", "price"] },
            { model: VariantItems, attributes: ["id", "name", "priceModifier"] }, // ← INI BARU
            {
              model: IngredientItems,
              include: [{ model: Ingredients, attributes: ["id", "name", "price"] }],
            },
          ],
        },
      ],
    });

    return res.status(201).json({ message: "Order created", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order", error });
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
              include: [
                {
                  model: MenuVariantGroups,
                  attributes: ["id"],
                  include: [
                    {
                      model: VariantGroups,
                      attributes: ["id", "name"],
                      include: [
                        {
                          model: VariantItems,
                          attributes: ["id", "name", "priceModifier"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: IngredientItems,
              include: [
                {
                  model: Ingredients,
                  attributes: ["id", "name", "price"],
                },
              ],
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

// Get Order By ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await Orders.findByPk(id, {
      include: [
        {
          model: OrderItems,
          as: "orderItems",
          include: [
            {
              model: Menu,
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: MenuVariantGroups,
                  attributes: ["id"],
                  include: [
                    {
                      model: VariantGroups,
                      attributes: ["id", "name"],
                      include: [
                        {
                          model: VariantItems,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: IngredientItems,
              include: [
                {
                  model: Ingredients,
                  attributes: ["id", "name", "price"],
                },
              ],
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


//Update Order

// Update Order (cascade ke orderItems kalau served/cancelled)
export const updateOrder = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await Orders.findByPk(id, { transaction: t });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    // 1. Update status order
    await order.update({ status }, { transaction: t });

    // 2. Cascade ke semua orderItems kalau served / cancelled
    if (status === "served" || status === "cancelled") {
      await OrderItems.update(
        { status },
        {
          where: { orderId: id },
          transaction: t,
        }
      );
    }

    await t.commit();

    // Re-fetch dengan relasi biar FE langsung dapet data fresh
    const updated = await Orders.findByPk(id, {
      include: [
        {
          model: OrderItems,
          as: "orderItems",
          include: [
            { model: Menu, attributes: ["id", "name", "price"] },
            {
              model: IngredientItems,
              include: [{ model: Ingredients, attributes: ["id", "name", "price"] }],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Order updated",
      data: updated,
    });
  } catch (error) {
    await t.rollback();
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