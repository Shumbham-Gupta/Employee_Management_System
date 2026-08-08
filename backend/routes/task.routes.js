import express from "express";
import { 
  createTask,
  getTasks,
  updateTask,
  updateAdminStatus,
  updateEmployeeStatus,
  addTaskComment,
  deleteTask
} from "../controllers/task.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Create Task: Admin only
router.post("/", verifyToken, verifyAdmin, createTask);

// ✅ Get Tasks: Authenticated users (Admin gets all, Employee gets assigned tasks)
router.get("/", verifyToken, getTasks);

// ✅ Edit full Task details: Admin only
router.put("/:id", verifyToken, verifyAdmin, updateTask);

// ✅ Admin updates adminStatus only: Admin only
router.put("/admin/:id", verifyToken, verifyAdmin, updateAdminStatus);

// ✅ Employee updates employeeStatus: Authenticated user
router.put("/employee/:id", verifyToken, updateEmployeeStatus);

// ✅ Add comment / update note to task: Authenticated users (Admin or assigned Employee)
router.post("/:id/comments", verifyToken, addTaskComment);

// ✅ Delete task: Admin only
router.delete("/:id", verifyToken, verifyAdmin, deleteTask);

export default router;

