import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD format for easy daily querying
      required: true,
      index: true,
    },
    clockIn: {
      type: Date,
      required: true,
    },
    clockOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Present", "Late", "Half-Day", "Absent"],
      default: "Present",
    },
    totalHours: {
      type: Number,
      default: 0, // In hours (float)
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance logs per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
