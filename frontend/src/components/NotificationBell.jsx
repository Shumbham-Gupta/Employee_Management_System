import React, { useState, useRef, useEffect } from "react";
import { Bell, AlertTriangle, Clock } from "lucide-react";

export default function NotificationBell({ tasks = [] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Find tasks due within 48 hours or overdue
  const now = new Date();
  const upcomingTasks = tasks.filter((t) => {
    if (!t.deadline || t.adminStatus === "Completed" || t.employeeStatus === "Completed") return false;
    const deadline = new Date(t.deadline);
    const diffHours = (deadline - now) / (1000 * 60 * 60);
    return diffHours <= 48; // Overdue or due within 2 days
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAlerts = upcomingTasks.length > 0;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative p-2.5 rounded-xl border transition ${
          hasAlerts
            ? "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60"
            : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
        }`}
        title="Deadline Alerts & Notifications"
      >
        <Bell size={20} className={hasAlerts ? "animate-bounce text-amber-600 dark:text-amber-400" : ""} />
        {hasAlerts && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {upcomingTasks.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 py-3 z-50 transition-colors">
          <div className="px-4 pb-2 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h4 className="font-bold text-gray-800 dark:text-white text-sm flex items-center gap-1.5">
              🔔 Notifications
            </h4>
            <span className="text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
              {upcomingTasks.length} Alerts
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-slate-400 text-center py-6">
                No urgent deadline alerts 🎉
              </p>
            ) : (
              upcomingTasks.map((task) => {
                const isOverdue = new Date(task.deadline) < now;
                return (
                  <div key={task._id} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition text-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className={isOverdue ? "text-rose-500 shrink-0 mt-0.5" : "text-amber-500 shrink-0 mt-0.5"} size={16} />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-slate-100">{task.title}</p>
                        <p className="text-gray-500 dark:text-slate-400 mt-0.5">
                          {isOverdue ? (
                            <span className="text-rose-600 dark:text-rose-400 font-bold">Overdue</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">Due Soon</span>
                          )}{" "}
                          • {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
