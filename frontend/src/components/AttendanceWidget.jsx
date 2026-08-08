import React, { useState, useEffect } from "react";
import { clockIn, clockOut, fetchMyAttendance } from "../utils/api.js";
import { toast } from "react-toastify";
import { Clock, LogIn, LogOut, CheckCircle2 } from "lucide-react";

export default function AttendanceWidget() {
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await fetchMyAttendance();
      setTodayRecord(data.today);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleClockIn = async () => {
    setActionLoading(true);
    try {
      const res = await clockIn();
      toast.success("🎯 Clocked in successfully!");
      setTodayRecord(res.attendance);
    } catch (err) {
      toast.error(err.response?.data?.error || "Clock in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    try {
      const res = await clockOut();
      toast.success("👋 Clocked out successfully!");
      setTodayRecord(res.attendance);
    } catch (err) {
      toast.error(err.response?.data?.error || "Clock out failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow border border-gray-200 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400">
        Loading attendance status...
      </div>
    );
  }

  const isClockedIn = Boolean(todayRecord?.clockIn);
  const isClockedOut = Boolean(todayRecord?.clockOut);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800 mb-8 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="text-indigo-600 dark:text-indigo-400" size={22} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daily Attendance</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isClockedIn ? (
            <button
              onClick={handleClockIn}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition"
            >
              <LogIn size={18} /> Clock In
            </button>
          ) : !isClockedOut ? (
            <button
              onClick={handleClockOut}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition"
            >
              <LogOut size={18} /> Clock Out
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-semibold rounded-xl text-sm border dark:border-slate-700">
              <CheckCircle2 size={18} className="text-emerald-500" /> Shift Completed
            </div>
          )}
        </div>
      </div>

      {/* Attendance Stats Cards */}
      {todayRecord && (
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 text-center text-xs">
          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700/60">
            <span className="text-gray-400 dark:text-slate-400 block font-medium">Clock In</span>
            <span className="font-bold text-gray-800 dark:text-slate-200 text-sm mt-0.5 block">
              {new Date(todayRecord.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700/60">
            <span className="text-gray-400 dark:text-slate-400 block font-medium">Clock Out</span>
            <span className="font-bold text-gray-800 dark:text-slate-200 text-sm mt-0.5 block">
              {todayRecord.clockOut
                ? new Date(todayRecord.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "--:--"}
            </span>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border dark:border-slate-700/60">
            <span className="text-gray-400 dark:text-slate-400 block font-medium">Total Hours</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 block">
              {todayRecord.totalHours ? `${todayRecord.totalHours.toFixed(1)} hrs` : "In Progress"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
