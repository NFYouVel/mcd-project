import { Payment } from "../models/Payment.js";
import { calculateTotal } from "../utils/calculateTotal.js";

export const syncPayment = async (orderId: string) => {
  const payment = await Payment.findOne({ where: { orderId } });
  if (!payment) return null;

  const total = await calculateTotal(orderId);

  await payment.update({ total_price: total });

  return total;
};