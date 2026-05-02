import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";
import { getAllOrders, updateOrder, createOrder, getOrderById } from "../controllers/order.controller.js";

const router: Router = Router();

router.get('/', authMiddleware, roleMiddleware('manager', 'cashier'), getAllOrders);
router.get('/:id', authMiddleware, roleMiddleware('manager', 'cashier'), getOrderById);
router.put('/:id', authMiddleware, roleMiddleware('manager', 'cashier'), updateOrder);
router.post('/', createOrder);

export default router;