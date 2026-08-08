import React, { useEffect, useState } from "react";
import { fetchAllLeaves, updateLeaveStatus } from "../../utils/api.js";
import { exportToCSV } from "../../utils/csvExport.js";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Clock, Download, Palmtree } from "lucide-react";

export default function LeaveApprovalList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending"); // 'All' | 'Pending' | 'Approved' | 'Rejected'

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await fetchAllLeaves();
      setLeaves(data || []);
    } catch (err) {
      console.error("Failed to load leaves:", err);
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updateLeaveStatus(id, { status });
      toast.success(`Leave request ${status.toLowerCase()}!`);
      setLeaves((prev) =>
        prev.map((l) => (l._id === id ? res.leave : l))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update leave status");
    }
  };

  const handleExportLeaves = () => {
    const dataToExport = leaves.map((l) => ({
      Employee: l.employee?.name || "Unknown",
      Department: l.employee?.department || "General",
      LeaveType: l.leaveType,
      StartDate: new Date(l.startDate).toLocaleDateString(),
      EndDate: new Date(l.endDate).toLocaleDateString(),
      Reason: l.reason,
      Status: l.status,
    }));
    exportToCSV("leave_applications.csv", dataToExport);
    toast.success("Exported leave applications report!");
  };

  const filteredLeaves = leaves.filter((l) => {
    if (activeTab === "All") return true;
    return l.status === activeTab;
  });

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  const statusBadges = {
    Pending: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    Approved: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
    Rejected: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900",
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-500 dark:text-slate-400">Loading leave requests...</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border border-gray-200 dark:border-slate-800 p-6 mt-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            🌴 Employee Leave Applications
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Review and approve or reject employee leave submissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-200 dark:border-amber-900">
            {pendingCount} Pending Action
          </span>
          <button
            onClick={handleExportLeaves}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-slate-800 pb-3 mb-5 overflow-x-auto">
        {[
          { key: "Pending", label: `⏳ Pending (${pendingCount})` },
          { key: "Approved", label: `✅ Approved (${approvedCount})` },
          { key: "Rejected", label: `❌ Rejected (${rejectedCount})` },
          { key: "All", label: `📋 All Requests (${leaves.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      {filteredLeaves.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-center py-8 text-sm">
          No {activeTab !== "All" ? activeTab.toLowerCase() : ""} leave applications found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 text-xs font-semibold uppercase border-b dark:border-slate-700">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              {filteredLeaves.map((l) => {
                const startDate = new Date(l.startDate);
                const endDate = new Date(l.endDate);
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <tr key={l._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-white">
                      {l.employee?.name || "Employee"}
                      <span className="block text-xs text-gray-400 dark:text-slate-400 font-normal">
                        {l.employee?.department || "General"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-gray-700 dark:text-slate-200">
                      {l.leaveType}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 dark:text-slate-300 text-xs">
                      <div>
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                      </div>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        ({days} day{days > 1 ? "s" : ""})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 dark:text-slate-300 max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusBadges[l.status]}`}>
                        {l.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {l.status === "Pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(l._id, "Approved")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(l._id, "Rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-slate-500 italic">
                          Decided on {new Date(l.updatedAt || l.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
