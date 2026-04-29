import { Router } from "express";
import * as ctrl from "../controllers/menuSection.controller.js";

const router : Router= Router();
router.get("/", ctrl.getAllSections);
router.get("/:id", ctrl.getSectionById);
router.post("/", ctrl.createSection);
router.put("/:id", ctrl.updateSection);
router.delete("/:id", ctrl.deleteSection);
export default router;