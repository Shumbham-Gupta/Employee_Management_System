

import React, { useEffect, useState, useContext, useRef } from "react";
import API, { fetchMyLeaves, deleteTask } from "../utils/api.js";
import TaskCard from "../components/TaskCard";
import AttendanceWidget from "../components/AttendanceWidget";
import LeaveModal from "../components/LeaveModal";
import TaskFilterBar from "../components/TaskFilterBar";
import NotificationBell from "../components/NotificationBell";
import ProfileModal from "../components/ProfileModal";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { CalendarPlus, Sun, Moon, User } from "lucide-react";

export default function EmployeeDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [tasks, setTasks] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const firstLoad = useRef(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const fetchMyTasks = async () => {
    try {
      if (!user?._id) return;
      setLoading(true);
      const res = await API.get(`/tasks?userId=${user._id}&role=employee`);
      const validTasks = Array.isArray(res.data) ? res.data.filter((t) => t && t._id) : [];
      setTasks(validTasks);

      if (firstLoad.current) {
        toast.info("✅ Your dashboard is up to date!", { autoClose: 2000 });
        firstLoad.current = false;
      }
    } catch (err) {
      console.error("Fetch tasks error:", err);
      toast.error("Failed to fetch your tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadLeaves = async () => {
    try {
      const leaves = await fetchMyLeaves();
      setMyLeaves(leaves);
    } catch (err) {
      console.error("Leaves fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMyTasks();
    loadLeaves();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/employee/${id}`, { employeeStatus: status });
      fetchMyTasks();
      toast.success(`🎯 Status updated to ${status}`, { autoClose: 2000 });
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const counts = tasks.reduce((acc, t) => {
    const status = t.employeeStatus || "Not Started";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete task");
    }
  };

  // Filter & Sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const searchMatches = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatches =
        statusFilter === "All" ||
        task.employeeStatus === statusFilter ||
        task.adminStatus === statusFilter;

      const priorityMatches =
        priorityFilter === "All" || (task.priority || "Medium") === priorityFilter;

      return searchMatches && statusMatches && priorityMatches;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            Hey {user?.name || "Employee"} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {user?.designation || "Team Member"} • {user?.department || "General"}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 transition text-sm font-medium"
          >
            <CalendarPlus size={18} /> Apply Leave
          </button>

          {/* Notifications */}
          <NotificationBell tasks={tasks} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </button>

          {/* Profile Modal Trigger */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition"
            title="Account Settings"
          >
            <User size={20} />
          </button>

          <button
            onClick={logout}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </div>


      {/* Attendance Widget */}
      <AttendanceWidget />

      {/* Leave Status History */}
      {myLeaves.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800 mb-8">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            🌴 Recent Leave Requests
          </h2>
          <div className="flex flex-wrap gap-4">
            {myLeaves.slice(0, 3).map((l) => (
              <div key={l._id} className="p-3 bg-gray-50 dark:bg-slate-800/60 border dark:border-slate-700/60 rounded-xl flex-1 min-w-[200px] text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-700 dark:text-slate-200">{l.leaveType}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    l.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" :
                    l.status === "Rejected" ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300" : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                  }`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-slate-400">
                  {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
        {["Not Started", "In Progress", "Completed"].map((status) => (
          <div
            key={status}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl text-center border border-gray-200 dark:border-slate-800 shadow hover:-translate-y-1 transition duration-200"
          >
            <p className="text-gray-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">{status}</p>
            <h3
              className={`text-3xl font-bold ${
                status === "Not Started"
                  ? "text-gray-600 dark:text-slate-400"
                  : status === "In Progress"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {counts[status] || 0}
            </h3>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">
          📋 Your Assigned Tasks ({filteredTasks.length})
        </h2>


        {/* Task Search & Filter Bar */}
        <TaskFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          role="employee"
        />

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onUpdate={updateStatus}
                  onDelete={handleDelete}
                  role="employee"
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 col-span-full">
                No tasks matching the selected filters.
              </p>
            )}
          </div>
        )}
      </div>


      {/* Leave Application Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onLeaveApplied={loadLeaves}
      />

      {/* Account Settings Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </div>
  );
}


