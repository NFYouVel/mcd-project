import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { getAllMenus, createMenu, updateMenu, deleteMenu } from "../controllers/menu.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get('/', getAllMenus);
router.post('/', authMiddleware, roleMiddleware('manager'), upload.single("image"), createMenu);
router.put('/:id', authMiddleware, roleMiddleware('manager'),upload.single("image"), updateMenu);
router.delete('/:id', authMiddleware, roleMiddleware('manager'), deleteMenu);

export default router;

// router.get("/", ctrl.getAllMenus);
// router.get("/:id", ctrl.getMenuById);
// router.post("/", upload.single("image"), ctrl.createMenu);
// router.put("/:id", upload.single("image"), ctrl.updateMenu);
// router.patch("/:id/toggle", ctrl.toggleAvailability);
// router.delete("/:id", ctrl.deleteMenu);