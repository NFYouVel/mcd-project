import { Router as ExpressRouter } from "express";
import {
  createVariantGroup,
  getAllVariantGroups,
  getVariantGroupById,
  updateVariantGroup,
  deleteVariantGroup,
} from "../controllers/variantGroups.controller.js";

const router: ExpressRouter = ExpressRouter();

// CREATE
router.post("/", createVariantGroup);

// READ ALL
router.get("/", getAllVariantGroups);

// READ ONE
router.get("/:id", getVariantGroupById);

// UPDATE
router.put("/:id", updateVariantGroup);

// DELETE
router.delete("/:id", deleteVariantGroup);

export default router;