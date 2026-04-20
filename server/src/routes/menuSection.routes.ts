import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createMenuSection,
  getAllMenuSections,
  getMenuSectionById,
  updateMenuSection,
  deleteMenuSection,
} from "../controllers/menuSection.controller.js";

const router: ExpressRouter = Router();

//Create MenuSection
router.post("/", createMenuSection);

//Get All MenuSections
router.get("/", getAllMenuSections);

//Get MenuSection by ID
router.get("/:id", getMenuSectionById);

//Update MenuSection
router.put("/:id", updateMenuSection);

//Delete MenuSection
router.delete("/:id", deleteMenuSection);

export default router;