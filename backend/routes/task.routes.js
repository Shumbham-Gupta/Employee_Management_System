

import express from "express";
import { 
  createTask,
  getTasks,
  updateAdminStatus,
  updateEmployeeStatus,
  deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);

// ✅ Admin updates only adminStatus
router.put("/admin/:id", updateAdminStatus);

// ✅ Employee updates only employeeStatus
router.put("/employee/:id", updateEmployeeStatus);

// ✅ Delete task
router.delete("/:id", deleteTask);

export default router;
