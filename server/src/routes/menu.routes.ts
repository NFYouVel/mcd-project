import { Router } from "express";
import * as ctrl from "../controllers/menu.controller.js";
import { upload } from "../middlewares/upload.js";

const router: Router = Router();
router.get("/", ctrl.getAllMenus);
router.get("/:id", ctrl.getMenuById);
router.post("/", upload.single("image"), ctrl.createMenu);
router.put("/:id", upload.single("image"), ctrl.updateMenu);
router.patch("/:id/toggle", ctrl.toggleAvailability);
router.delete("/:id", ctrl.deleteMenu);
export default router;