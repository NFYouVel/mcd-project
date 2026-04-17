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

// ✅ CREATE
router.post("/", createMenuSection);

// ✅ GET ALL
router.get("/", getAllMenuSections);

// ✅ GET BY ID
router.get("/:id", getMenuSectionById);

// ✅ UPDATE
router.put("/:id", updateMenuSection);

// ✅ DELETE
router.delete("/:id", deleteMenuSection);

export default router;