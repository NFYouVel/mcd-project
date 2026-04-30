import { Router as ExpressRouter } from "express";
import {
  createVariantItem,
  getAllVariantItems,
  getVariantItemById,
  updateVariantItem,
  deleteVariantItem,
} from "../controllers/variantItems.controller.js";

const router: ExpressRouter = ExpressRouter();

// CREATE
router.post("/", createVariantItem);

// READ ALL
router.get("/", getAllVariantItems);

// READ ONE
router.get("/:id", getVariantItemById);

// UPDATE
router.put("/:id", updateVariantItem);

// DELETE
router.delete("/:id", deleteVariantItem);

export default router;