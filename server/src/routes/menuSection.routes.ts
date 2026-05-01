import { Router } from "express";
import { createSection, deleteSection, getAllSections, getSectionById, updateSection } from "../controllers/menuSection.controller.js";
 "../controllers/menuSection.controller.js";

const router : Router= Router();
router.get("/", getAllSections);
router.get("/:id", getSectionById);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);
export default router;