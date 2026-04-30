import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createFilterMenuItem,
  getAllFilterMenuItems,
  getFiltersByMenu,
  deleteFilterMenuItem,
} from "../controllers/filterMenuItems.controller.js";

const router: ExpressRouter = Router();

// =============================================
// CREATE relation (menu ↔ filter)
// =============================================
router.post("/", createFilterMenuItem);

// =============================================
// GET all relations
// =============================================
router.get("/", getAllFilterMenuItems);

// =============================================
// GET filters by menuId
// =============================================
router.get("/menu/:menuId", getFiltersByMenu);

// =============================================
// DELETE relation by id
// =============================================
router.delete("/:id", deleteFilterMenuItem);

export default router;