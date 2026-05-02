import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createPackageItem,
  getAllPackageItems,
  updatePackageItem,
  deletePackageItem,
  getPackageItemsByPackageId
} from "../controllers/packageItems.controller.js";

const router:ExpressRouter = Router();

// Create package composition
router.post("/", createPackageItem);

// Get all package mappings
router.get("/", getAllPackageItems);

// Get all items inside specific package
router.get("/:id", getPackageItemsByPackageId);

// Update quantity of item inside package
router.put("/:id", updatePackageItem);

// Delete package item relation
router.delete("/:id", deletePackageItem);

export default router;