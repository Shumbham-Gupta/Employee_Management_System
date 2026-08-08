import express from "express";
import {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendance.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/clock-in", verifyToken, clockIn);
router.post("/clock-out", verifyToken, clockOut);
router.get("/my-attendance", verifyToken, getMyAttendance);
router.get("/all", verifyToken, verifyAdmin, getAllAttendance);

export default router;
