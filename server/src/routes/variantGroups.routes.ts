import { Router as ExpressRouter } from "express";
import {
  createVariantGroup,
  getAllVariantGroups,
  getVariantGroupById,
  updateVariantGroup,
  deleteVariantGroup,
  getAllVariantGroupsByMenu,
} from "../controllers/variantGroups.controller";

const router: ExpressRouter = ExpressRouter();

// ⚠️ IMPORTANT: specific routes MUST come before /:id
// otherwise Express matches "menu" as the :id param

// GET all variant groups for a specific menu
router.get("/menu/:menuId", getAllVariantGroupsByMenu);

// CRUD
router.post("/", createVariantGroup);
router.get("/", getAllVariantGroups);
router.get("/:id", getVariantGroupById);
router.put("/:id", updateVariantGroup);
router.delete("/:id", deleteVariantGroup);

export default router;