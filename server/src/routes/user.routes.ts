import { Router } from 'express';
import { createUser, userLogin, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';

const router: Router = Router();

router.post('/register', createUser);
router.post('/login', userLogin);

router.get('/', getAllUsers);          
router.get('/:id', getUserById);       
router.put('/:id', updateUser);        
router.delete('/:id', deleteUser);     

export default router;
