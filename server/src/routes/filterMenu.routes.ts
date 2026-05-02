import { Router } from "express";
import * as ctrl from "../controllers/filterMenu.controller.js";

const router: Router = Router();
router.get("/", ctrl.getAllFilterMenus);
router.get("/:id", ctrl.getFilterMenuById);
router.post("/", ctrl.createFilterMenu);
router.put("/:id", ctrl.updateFilterMenu);
router.delete("/:id", ctrl.deleteFilterMenu);
export default router;