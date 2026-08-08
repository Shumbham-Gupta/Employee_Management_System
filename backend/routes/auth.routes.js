import express from "express";
import { registerAdmin, login, registerEmployee, changePassword } from "../controllers/auth.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/register-employee", verifyToken, verifyAdmin, registerEmployee);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);

export default router;



