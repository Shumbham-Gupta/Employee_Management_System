import React, { useEffect, useState } from "react";
import { fetchAllAttendance } from "../utils/api.js";
import { exportToCSV } from "../utils/csvExport.js";
import { toast } from "react-toastify";
import { Clock, Calendar, Download, CheckCircle2, AlertCircle } from "lucide-react";

export default function AttendanceLogList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttendanceLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllAttendance();
      setRecords(data || []);
    } catch (err) {
      console.error("Failed to fetch attendance logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceLogs();
  }, []);

  const handleExportAttendance = () => {
    const dataToExport = records.map((r) => ({
      Employee: r.employee?.name || "Unknown",
      Department: r.employee?.department || "General",
      Date: r.date,
      ClockIn: r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : "--",
      ClockOut: r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : "--",
      TotalHours: r.totalHours ? r.totalHours.toFixed(2) : "In Progress",
      Status: r.status,
    }));
    exportToCSV("attendance_logs.csv", dataToExport);
    toast.success("Exported attendance logs report!");
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-500 dark:text-slate-400">Loading attendance logs...</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border border-gray-200 dark:border-slate-800 p-6 mt-8 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            ⏰ Employee Attendance Logs
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Real-time daily shift clock-in times and total working hours
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-bold border border-indigo-100 dark:border-indigo-900">
            Records: {records.length}
          </span>
          <button
            onClick={handleExportAttendance}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-center py-8 text-sm">
          No employee attendance records logged yet today.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 text-xs font-semibold uppercase border-b dark:border-slate-700">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Hours Logged</th>
                <th className="py-3 px-4">Punctuality</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-white">
                    {r.employee?.name || "Employee"}
                    <span className="block text-xs text-gray-400 dark:text-slate-400 font-normal">
                      {r.employee?.department || "General"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-slate-300 font-mono">
                    {r.date}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {r.clockIn ? new Date(r.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {r.clockOut ? new Date(r.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active Shift"}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-bold text-gray-800 dark:text-slate-200">
                    {r.totalHours ? `${r.totalHours.toFixed(1)} hrs` : "In Progress"}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        r.status === "Present"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
