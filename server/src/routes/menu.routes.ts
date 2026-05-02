import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { getAllMenus, getMenuById, toggleAvailability, createMenu, updateMenu, deleteMenu } from "../controllers/menu.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get('/', getAllMenus);
router.get("/:id", getMenuById);
router.patch("/:id/toggle", authMiddleware,  roleMiddleware('manager', 'cashier'),  toggleAvailability);
router.post('/', authMiddleware, roleMiddleware('manager'), upload.single("image"), createMenu);
router.put('/:id', authMiddleware, roleMiddleware('manager'),upload.single("image"), updateMenu);
router.delete('/:id', authMiddleware, roleMiddleware('manager'), deleteMenu);

export default router;
