import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  createType,
  getAllTypes,
  getTypeById,
  updateType,
  deleteType,
} from "../controllers/type.controller.js";

const router: ExpressRouter = Router();

// ✅ CREATE
router.post("/", createType);

// ✅ GET ALL
router.get("/", getAllTypes);

// ✅ GET BY ID
router.get("/:id", getTypeById);

// ✅ UPDATE
router.put("/:id", updateType);

// ✅ DELETE
router.delete("/:id", deleteType);

export default router;