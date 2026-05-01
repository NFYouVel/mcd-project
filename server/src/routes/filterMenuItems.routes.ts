import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createFilterMenu,
  getAllFilterMenus,
  getFilterMenuById,
  deleteFilterMenu,
} from "../controllers/filterMenu.controller.js";

const router: ExpressRouter = Router();

// =============================================
// CREATE relation (menu ↔ filter)
// =============================================
router.post("/", createFilterMenu);

// =============================================
// GET all relations
// =============================================
router.get("/", getAllFilterMenus);

// =============================================
// GET filters by menuId
// =============================================
router.get("/menu/:menuId", getFilterMenuById);

// =============================================
// DELETE relation by id
// =============================================
router.delete("/:id", deleteFilterMenu);

export default router;