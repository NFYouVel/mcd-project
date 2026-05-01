
import { OrderItems } from "../models/OrderItems.js";
import { IngredientItems } from "../models/IngredientItems.js";
import { Menu } from "../models/Menu.js";
import { Payment } from "../models/Payment.js";
import { Orders } from "../models/Orders.js";
import { calculateTotal } from "../utils/calculateTotal.js";

export const syncPayment = async (orderId: string) => {
    const order = await Orders.findByPk(orderId, {
        include: {
            model: OrderItems,
            include: [
                {
                    model: Menu,
                    attributes: ["price"],
                },
                {
                    model: IngredientItems
                }
            ]
        },
    });
    if (!order) {
        return 0;
    }

    let total = 0;
    for (const item of order.orderItems || []) {
        total += item.menu.price;  // ← hapus * item.quantity

        for (const ingredient of item.ingredientItems || []) {
            total += ingredient.price * ingredient.quantity;
        }
    }

    const payment = await Payment.findOne({ where: { orderId } });

    if (payment) {
        await payment.update({ total_price: total });
    }

    return total;
}