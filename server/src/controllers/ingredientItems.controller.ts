import e, { Request, Response } from "express";
import { IngredientItems } from "../models/IngredientItems.js";
import { Ingredients } from "../models/Ingredients.js";
import { OrderItems } from "../models/OrderItems.js";
import { syncPayment } from "../utils/syncPayment.js";
import { Orders } from "../models/Orders.js";


//Add Ingredient Item
export const addIngredientItem = async (req: Request, res: Response) => {
    try {
        const { orderItemId } = req.params as { orderItemId: string };
        const { ingredientId, quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
        const orderItem = await OrderItems.findByPk(orderItemId);

        if (!orderItem) {
            return res.status(400).json({
                message: "Order item not found",
            });
        }

        const order = await Orders.findByPk(orderItem.orderId);
        if (!order || order.status !== "pending") {
            return res.status(400).json({
                message: "Order already processed",
            });
        }

        const ingredient = await Ingredients.findByPk(ingredientId);
        if (!ingredient) {
            return res.status(400).json({
                message: "Ingredient not found",
            });
        }

        const existing = await IngredientItems.findOne({
            where: {
                orderItemsId: orderItemId,
                ingredientsId: ingredientId,
            },
        });

        if (existing) {
            const updated = await existing.update({
                quantity: existing.quantity + quantity,
            });

            const total = await syncPayment(order.id);
            return res.status(200).json({
                message: "Ingredient updated",
                data: updated,
                payment_total: total,
            });
        }

        const created = await IngredientItems.create({
            orderItemsId: orderItemId,
            ingredientsId: ingredientId,
            quantity,
            price: ingredient.price,
        });

        const total = await syncPayment(order.id);

        return res.status(201).json({
            message: "Ingredient added",
            data: created,
            payment_total: total,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error adding ingredient",
            error,
        });
    }
}