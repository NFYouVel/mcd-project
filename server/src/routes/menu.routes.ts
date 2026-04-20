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

//Create Menu
router.post("/", createMenu);

//Get All Menus
router.get("/", getAllMenus);

//Get Menu by ID
router.get("/:id", getMenuById);

//Update Menu
router.put("/:id", updateMenu);

//Delete Menu
router.delete("/:id", deleteMenu);

export default router;