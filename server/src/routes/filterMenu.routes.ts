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

//Create FilterMenu
router.post("/", createFilterMenu);

//Get All FilterMenus
router.get("/", getAllFilterMenus);

//Get FilterMenu by ID
router.get("/:id", getFilterMenuById);

//Update FilterMenu
router.put("/:id", updateFilterMenu);

//Delete FilterMenu
router.delete("/:id", deleteFilterMenu);

export default router;