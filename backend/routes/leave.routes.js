import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leave.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/apply", verifyToken, applyLeave);
router.get("/my-leaves", verifyToken, getMyLeaves);
router.get("/all", verifyToken, verifyAdmin, getAllLeaves);
router.put("/:id/status", verifyToken, verifyAdmin, updateLeaveStatus);

export default router;
