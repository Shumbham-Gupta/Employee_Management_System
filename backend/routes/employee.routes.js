import express from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employee.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ All employee routes require authentication and admin privileges
router.get("/", verifyToken, verifyAdmin, getEmployees);
router.post("/", verifyToken, verifyAdmin, createEmployee);
router.put("/:id", verifyToken, verifyAdmin, updateEmployee);
router.delete("/:id", verifyToken, verifyAdmin, deleteEmployee);

export default router;


