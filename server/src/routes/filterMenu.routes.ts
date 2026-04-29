import { Router } from "express";
import * as ctrl from "../controllers/filterMenu.controller.js";

const router: Router = Router();
router.get("/", ctrl.getAllFilters);
router.get("/:id", ctrl.getFilterById);
router.post("/", ctrl.createFilter);
router.put("/:id", ctrl.updateFilter);
router.delete("/:id", ctrl.deleteFilter);
export default router;