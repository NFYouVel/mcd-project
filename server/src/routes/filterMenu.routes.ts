import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import {
  getAllFilterMenus,
  getFilterMenuById,
  createFilterMenu,
  updateFilterMenu,
  deleteFilterMenu,
} from "../controllers/filterMenu.controller.js";

const router: ExpressRouter = Router();

// =============================================
// FILTER MENU ROUTES
// =============================================

// GET all
router.get("/", getAllFilterMenus);

// GET by ID
router.get("/:id", getFilterMenuById);

// CREATE
router.post("/", createFilterMenu);

// UPDATE
router.put("/:id", updateFilterMenu);

// DELETE
router.delete("/:id", deleteFilterMenu);

export default router;