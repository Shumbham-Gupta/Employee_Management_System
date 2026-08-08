import Attendance from "../models/Attendance.js";

// Helper to get today's date string YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split("T")[0];

// 🟢 CLOCK IN
export const clockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = getTodayString();

    const existing = await Attendance.findOne({ employee: userId, date: todayStr });
    if (existing) {
      return res.status(400).json({ error: "You have already clocked in today", attendance: existing });
    }

    const now = new Date();
    // Determine status (e.g. if clocked in after 10:00 AM, mark Late)
    const status = now.getHours() >= 10 ? "Late" : "Present";

    const attendance = await Attendance.create({
      employee: userId,
      date: todayStr,
      clockIn: now,
      status,
    });

    res.status(201).json({ message: "Clocked in successfully", attendance });
  } catch (err) {
    console.error("Clock in error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔴 CLOCK OUT
export const clockOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = getTodayString();

    const attendance = await Attendance.findOne({ employee: userId, date: todayStr });
    if (!attendance) {
      return res.status(400).json({ error: "No clock-in record found for today" });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ error: "You have already clocked out today", attendance });
    }

    const now = new Date();
    attendance.clockOut = now;

    // Calculate total hours
    const diffMs = now - new Date(attendance.clockIn);
    const hours = (diffMs / (1000 * 60 * 60)).toFixed(2);
    attendance.totalHours = parseFloat(hours);

    await attendance.save();
    res.json({ message: "Clocked out successfully", attendance });
  } catch (err) {
    console.error("Clock out error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📅 GET MY ATTENDANCE
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Attendance.find({ employee: userId }).sort({ date: -1 }).limit(30);
    const todayStr = getTodayString();
    const todayRecord = await Attendance.findOne({ employee: userId, date: todayStr });

    res.json({ records, today: todayRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👥 GET ALL ATTENDANCE (ADMIN)
export const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || getTodayString();

    const records = await Attendance.find({ date: targetDate })
      .populate("employee", "name email department designation")
      .sort({ clockIn: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
