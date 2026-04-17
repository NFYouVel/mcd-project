import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createFilterMenu,
  getAllFilterMenus,
  getFilterMenuById,
  updateFilterMenu,
  deleteFilterMenu,
} from "../controllers/filterMenu.controller.js";

const router: ExpressRouter = Router();

// ✅ CREATE
router.post("/", createFilterMenu);

// ✅ GET ALL
router.get("/", getAllFilterMenus);

// ✅ GET BY ID
router.get("/:id", getFilterMenuById);

// ✅ UPDATE
router.put("/:id", updateFilterMenu);

// ✅ DELETE
router.delete("/:id", deleteFilterMenu);

export default router;