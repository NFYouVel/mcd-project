import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router: ExpressRouter = Router();

//get All Users
router.get("/", getAllUsers);

//Get User by ID
router.get("/:id", getUserById);

//Update User
router.post("/", createUser);

//Update User
router.put("/:id", updateUser);

//Delete User
router.delete("/:id", deleteUser);

export default router;