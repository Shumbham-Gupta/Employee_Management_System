import React from "react";
import { Users, CheckCircle, AlertTriangle, TrendingUp, Calendar, Briefcase } from "lucide-react";

export default function AnalyticsOverview({ tasks = [], employees = [], leaves = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.adminStatus === "Completed" || t.employeeStatus === "Completed"
  ).length;
  const activeTasks = tasks.filter(
    (t) => t.adminStatus === "Active" || t.employeeStatus === "In Progress"
  ).length;
  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && t.adminStatus !== "Completed"
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;

  // Department Workload Breakdown
  const deptCounts = tasks.reduce((acc, task) => {
    const dept = task.assignedTo?.department || "General";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const maxDeptTasks = Math.max(...Object.values(deptCounts), 1);

  return (
    <div className="mb-10 space-y-6">
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Employees */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Employees</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{employees.length}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users size={22} />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">Active team members</p>
        </div>

        {/* Active Tasks */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Active Tasks</p>
              <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{activeTasks}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <Briefcase size={22} />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">{totalTasks} total tasks logged</p>
        </div>

        {/* Completion Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Completion Rate</p>
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completionRate}%</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp size={22} />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Attention Needed / Overdue */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Overdue / Leaves</p>
              <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {overdueTasks + pendingLeaves}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertTriangle size={22} />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">
            {overdueTasks} overdue • {pendingLeaves} pending leaves
          </p>
        </div>
      </div>

      {/* Department Workload Distribution */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          🏢 Department Workload Breakdown
        </h3>

        {Object.keys(deptCounts).length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-slate-500">No task data available for department distribution.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / maxDeptTasks) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-slate-300">
                    <span>{dept}</span>
                    <span>{count} task{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
