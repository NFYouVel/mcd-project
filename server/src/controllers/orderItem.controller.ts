import { Request, Response } from "express";
import { OrderItems } from "../models/OrderItems.js";
import { Orders } from "../models/Orders.js";
import { Menu } from "../models/Menu.js";
import { Payment } from "../models/Payment.js";
import { calculateTotal } from "../utils/calculateTotal.js";
import { syncPayment } from "../utils/syncPayment.js";
import { VariantItems } from "../models/VariantItems.js";
import { VariantGroups } from "../models/VariantGroups.js";
import { Ingredients } from "../models/Ingredients.js";
import { IngredientItems } from "../models/IngredientItems.js";
import { MenuVariantGroups } from "../models/MenuVariantGroups.js";
import { Op } from "sequelize";

// ─── Helper: build include for variant chain ───────────────────────────────
const variantInclude = (filterIds?: string[]) => ({
  model: Menu,
  attributes: ["id", "name", "price", "isPackage"],
  include: [
    {
      model: MenuVariantGroups,
      include: [
        {
          model: VariantGroups,
          as: "variantGroup",
          include: [
            {
              model: VariantItems,
              as: "variantItems",
              ...(filterIds && filterIds.length > 0
                ? { where: { id: { [Op.in]: filterIds } } }
                : {}),
              required: false,
            },
          ],
        },
      ],
    },
  ],
});

// ─── CREATE ────────────────────────────────────────────────────────────────
export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      menuId,
      quantity = 1,
      variantItemIds = [],
      ingredients = [],
    } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const order = await Orders.findByPk(orderId);
    if (!order) return res.status(400).json({ message: "Invalid orderId" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Order already processed" });

    const menu = await Menu.findByPk(menuId);
    if (!menu) return res.status(400).json({ message: "Invalid menuId" });

    // Create base order item
    const item = await OrderItems.create({ orderId, menuId });

    let extraCost = 0;

    // ── Ingredients ──
    for (const selected of ingredients) {
      const ingredient = await Ingredients.findByPk(selected.ingredientsId);
      if (!ingredient)
        return res
          .status(400)
          .json({ message: `Invalid ingredient ID: ${selected.ingredientsId}` });

      extraCost += ingredient.price * selected.quantity;

      await IngredientItems.create({
        orderItemsId: item.id,
        ingredientsId: ingredient.id,
        quantity: selected.quantity,
        price: ingredient.price,
      });
    }

    // ── Variants: validate & compute extra cost ──
    let selectedVariants: VariantItems[] = [];
    if (variantItemIds.length > 0) {
      selectedVariants = await VariantItems.findAll({
        where: { id: variantItemIds },
      });

      if (selectedVariants.length !== variantItemIds.length)
        return res
          .status(400)
          .json({ message: "One or more variant items are invalid" });

      extraCost += selectedVariants.reduce((sum, v) => sum + v.priceModifier, 0);
    }

    // ── Re-fetch item with full variant chain filtered to selected IDs ──
    const fullItem = await OrderItems.findByPk(item.id, {
      include: [
        { model: Orders },
        variantInclude(variantItemIds),
        {
          model: IngredientItems,
          include: [
            { model: Ingredients, attributes: ["id", "name", "price"] },
          ],
        },
      ],
    });

    const total = await syncPayment(orderId);

    return res.status(201).json({
      message: "Order item added successfully",
      data: fullItem,
      selectedVariants,
      extraCost,
      total,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating order item", error });
  }
};

// ─── GET ALL ───────────────────────────────────────────────────────────────
export const getAllOrderItems = async (req: Request, res: Response) => {
  try {
    const items = await OrderItems.findAll({
      include: [
        { model: Orders },
        {
          model: Menu,
          attributes: ["id", "name", "price", "isPackage"],
          include: [
            {
              model: MenuVariantGroups,
              include: [
                {
                  model: VariantGroups,
                  as: "variantGroup",
                  include: [
                    {
                      model: VariantItems,
                      as: "variantItems",
                      required: false,
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
            { model: Ingredients, attributes: ["id", "name", "price"] },
          ],
        },
      ],
    });

    return res.status(200).json({ message: "Success", data: items });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items", error });
  }
};

// ─── GET BY ID ─────────────────────────────────────────────────────────────
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await OrderItems.findByPk(id, {
      include: [
        { model: Orders },
        {
          model: Menu,
          attributes: ["id", "name", "price", "isPackage"],
          include: [
            {
              model: MenuVariantGroups,
              include: [
                {
                  model: VariantGroups,
                  as: "variantGroup",
                  include: [
                    {
                      model: VariantItems,
                      as: "variantItems",
                      required: false,
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
            { model: Ingredients, attributes: ["id", "name", "price"] },
          ],
        },
      ],
    });

    if (!item) return res.status(404).json({ message: "Order item not found" });

    return res.status(200).json({ message: "Success", data: item });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching item", error });
  }
};

// ─── UPDATE ────────────────────────────────────────────────────────────────
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await OrderItems.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const order = await Orders.findByPk(item.orderId);
    if (!order) return res.status(400).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Order already processed" });

    const total = await syncPayment(item.orderId);

    return res.status(200).json({
      message: "Item updated successfully",
      data: item,
      payment_total: total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating item", error });
  }
};

// ─── DELETE ────────────────────────────────────────────────────────────────
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const item = await OrderItems.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const order = await Orders.findByPk(item.orderId);
    if (!order) return res.status(400).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Order already processed" });

    const orderId = item.orderId;

    await IngredientItems.destroy({ where: { orderItemsId: item.id } });
    await item.destroy();

    const total = await syncPayment(orderId);

    return res.status(200).json({
      message: "Item deleted successfully",
      payment_total: total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting item", error });
  }
};