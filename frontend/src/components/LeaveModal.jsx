import React, { useState } from "react";
import { applyLeave } from "../utils/api.js";
import { toast } from "react-toastify";
import { Calendar, X } from "lucide-react";

export default function LeaveModal({ isOpen, onClose, onLeaveApplied }) {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date!");
      return;
    }

    setLoading(true);
    try {
      const res = await applyLeave({ leaveType, startDate, endDate, reason });
      toast.success(res.message || "Leave application submitted!");
      if (onLeaveApplied) onLeaveApplied(res.leave);
      onClose();
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit leave application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-800 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="text-indigo-600 dark:text-indigo-400" size={22} /> Apply for Leave
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Casual Leave">🌴 Casual Leave</option>
              <option value="Sick Leave">🤒 Sick Leave</option>
              <option value="Paid Leave">🏖️ Paid Leave</option>
              <option value="Unpaid Leave">⚠️ Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              placeholder="State reason for leave..."
              className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-gray-400 dark:placeholder-slate-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-slate-300 border dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow text-sm"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
