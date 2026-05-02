import { Router } from "express";
import { login, forgetPassword, resetPassword } from "../controllers/auth.controller.js";
// import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

// api/auth/
const router: Router = Router();
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
// router.post("/register-admin", authMiddleware, roleMiddleware('manager'), registerAdmin);

export default router;