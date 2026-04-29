import { OrderItems } from "../models/OrderItems.js";
import { Menu } from "../models/Menu.js";

export const calculateTotal = async (orderId: string) => {
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