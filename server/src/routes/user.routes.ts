import { Router } from 'express';
import { registerAdmin, getAllUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/user.controller.js';
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();
router.get('/', getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware('manager'), getUserById);
router.post('/', authMiddleware, roleMiddleware('manager'), createUser);
router.put('/:id', authMiddleware, roleMiddleware('manager'), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('manager'), deleteUser);

export default router;