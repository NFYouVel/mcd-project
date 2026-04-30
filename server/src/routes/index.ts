import { Router } from "express";
import typeRoutes from "./type.routes.js";
import sectionRoutes from "./menuSection.routes.js";
import filterRoutes from "./filterMenu.routes.js";
import menuRoutes from "./menu.routes.js";
import AuthRoutes from "./auth.routes.js"
import orderRoutes from "./order.routes.js";

const router:Router = Router();
router.use("/types", typeRoutes);
router.use("/sections", sectionRoutes);
router.use("/filters", filterRoutes);
router.use("/menu", menuRoutes);

router.use('/auth', AuthRoutes);
router.use('/orders', orderRoutes);

// TBC
// // Hanya admin yang bisa CRUD admin users
// router.post('/admin/users', authMiddleware, roleMiddleware('manager'), createAdmin);

// // Admin & kasir bisa update order
// router.put('/orders/:id', authMiddleware, roleMiddleware('manager', 'cashier'), updateOrder);

// // Hanya admin bisa CRUD menu
// router.post('/menu', authMiddleware, roleMiddleware('manager'), createMenu);
export default router;