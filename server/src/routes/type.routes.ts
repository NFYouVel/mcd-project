import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";
import { getAllTypes, createType, updateType, deleteType } from "../controllers/type.controller.js";

const router: Router = Router();

router.get('/', getAllTypes); 
router.post('/', authMiddleware, roleMiddleware('manager'), createType);
router.put('/:id', authMiddleware, roleMiddleware('manager'), updateType);
router.delete('/:id', authMiddleware, roleMiddleware('manager'), deleteType);

export default router;