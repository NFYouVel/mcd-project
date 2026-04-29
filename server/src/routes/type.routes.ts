import { Router } from "express";
import * as ctrl from "../controllers/type.controller.js";

const router: Router = Router();
router.get("/", ctrl.getAllTypes);
router.get("/:id", ctrl.getTypeById);
router.post("/", ctrl.createType);
router.put("/:id", ctrl.updateType);
router.delete("/:id", ctrl.deleteType);
export default router;