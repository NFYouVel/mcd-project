import { Router } from 'express';
import { registerAdmin, getAllUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/user.controller.js';
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;