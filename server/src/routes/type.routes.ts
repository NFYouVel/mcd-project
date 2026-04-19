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

//Create Type
router.post("/", createType);

//Get All Types
router.get("/", getAllTypes);

//Get Type by ID
router.get("/:id", getTypeById);

//Update Type
router.put("/:id", updateType);

//Delete Type
router.delete("/:id", deleteType);

export default router;