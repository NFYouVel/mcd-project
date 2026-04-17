import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.controller.js";

const router: ExpressRouter = Router();

// ✅ CREATE
router.post("/", createMenu);

// ✅ GET ALL
router.get("/", getAllMenus);

// ✅ GET BY ID
router.get("/:id", getMenuById);

// ✅ UPDATE
router.put("/:id", updateMenu);

// ✅ DELETE
router.delete("/:id", deleteMenu);

export default router;