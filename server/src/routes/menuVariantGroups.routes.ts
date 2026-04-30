import { Router as ExpressRouter } from "express";
import {
  addMenuVariantGroup,
  getAllMenuVariantGroups,
  deleteMenuVariantGroup,
} from "../controllers/menuVariantGroups.controller.js";

const router: ExpressRouter = ExpressRouter();

// CREATE relation (menu ↔ variant group)
router.post("/", addMenuVariantGroup);

// GET all relations
router.get("/", getAllMenuVariantGroups);

// DELETE relation
router.delete("/:id", deleteMenuVariantGroup);

export default router;