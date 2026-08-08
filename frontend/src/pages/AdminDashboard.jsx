

import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import API, { fetchAllLeaves, deleteTask } from "../utils/api";
import AddEmployee from "../components/Others/AddEmployee";
import EmployeeList from "../components/Others/EmployeeList";
import LeaveApprovalList from "../components/Others/LeaveApprovalList";
import AttendanceLogList from "../components/AttendanceLogList";
import AnalyticsOverview from "../components/AnalyticsOverview";

import TaskFilterBar from "../components/TaskFilterBar";
import NotificationBell from "../components/NotificationBell";
import ProfileModal from "../components/ProfileModal";
import EditTaskModal from "../components/EditTaskModal";
import { exportToCSV } from "../utils/csvExport";
import { Sun, Moon, User, Download } from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch tasks
  const fetchAll = async () => {
    try {
      const res = await API.get("/tasks?role=admin");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees").catch(() => ({ data: [] }));
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employees");
    }
  };

  // Fetch leaves for analytics
  const fetchLeaves = async () => {
    try {
      const res = await fetchAllLeaves().catch(() => []);
      setLeaves(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchEmployees();
    fetchLeaves();
  }, []);

  // Create task
  const createTask = async (payload) => {
    try {
      await API.post("/tasks", payload);
      toast.success("Task created successfully!");
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Error creating task");
    }
  };

  // Update task status
  const updateStatus = async (id, adminStatus) => {
    try {
      await API.put(`/tasks/admin/${id}`, { adminStatus });
      toast.success("Task status updated!");
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  // Delete task
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

  // Add employee instantly to dropdown
  const addEmployeeToList = (employee) => {
    setEmployees((prev) => [...prev, employee]);
  };

  // Export Tasks to CSV
  const handleExportTasks = () => {
    const dataToExport = tasks.map((t) => ({
      Title: t.title,
      Description: t.description,
      AssignedTo: t.assignedTo?.name || "Unassigned",
      Department: t.assignedTo?.department || "General",
      Priority: t.priority || "Medium",
      AdminStatus: t.adminStatus || "New",
      EmployeeStatus: t.employeeStatus || "Not Started",
      Deadline: t.deadline ? new Date(t.deadline).toLocaleDateString() : "",
      CreatedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
    }));
    exportToCSV("tasks_report.csv", dataToExport);
    toast.success("Exported tasks report to CSV!");
  };

  // Filter & Sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const empMatch = task.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const searchMatches = titleMatch || empMatch;

      const statusMatches =
        statusFilter === "All" ||
        task.adminStatus === statusFilter ||
        task.employeeStatus === statusFilter;

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
            Admin Workspace 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Management & Analytics Portal</p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
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
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <AnalyticsOverview tasks={tasks} employees={employees} leaves={leaves} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation & Employee Add */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
              📝 Create New Task
            </h2>
            <TaskForm employees={employees} onCreate={createTask} />
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
              👤 Add New Employee
            </h2>
            <AddEmployee onAddEmployee={addEmployeeToList} />
          </div>
        </div>

        {/* Task List with Filters */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-gray-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                📋 Assigned Tasks ({filteredTasks.length})
              </h3>
              <button
                onClick={handleExportTasks}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg transition"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

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
              role="admin"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
                  <TaskCard
                    key={t._id}
                    task={t}
                    onUpdate={updateStatus}
                    onDelete={handleDelete}
                    onEdit={(taskToEdit) => setEditingTask(taskToEdit)}
                    role="admin"
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 col-span-full">
                  No tasks matching the selected filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmployeeList tasks={tasks} />

      <LeaveApprovalList />
      <AttendanceLogList />


      {/* Account Settings Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />

      {/* Admin Edit Task Modal */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        employees={employees}
        onTaskUpdated={fetchAll}
      />
    </div>
  );
};

export default AdminDashboard;



