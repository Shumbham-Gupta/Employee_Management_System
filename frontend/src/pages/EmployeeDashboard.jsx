

import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../utils/api.js";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { deleteTask } from "../utils/api.js";

export default function EmployeeDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);


  const fetchMyTasks = async () => {
  try {
    if (!user?._id) return;

    // Validate ObjectId format
    const isValidId = /^[0-9a-fA-F]{24}$/.test(user._id);
    if (!isValidId) {
      console.error("Invalid userId:", user._id);
      return;
    }

    setLoading(true);
    
    // ✅ Include role in query to satisfy backend
    const res = await API.get(`/tasks?userId=${user._id}&role=employee`);

    // ✅ Filter out any corrupt or missing tasks
    const validTasks = Array.isArray(res.data)
      ? res.data.filter((t) => t && t._id)
      : [];

    setTasks(validTasks);

    if (firstLoad.current) {
      toast.info("✅ Your tasks have been refreshed!", { autoClose: 2000 });
      firstLoad.current = false;
    }
  } catch (err) {
    console.error("Fetch tasks error:", err);
    toast.error("Failed to fetch your tasks");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMyTasks();
  }, [user]);




  // ✅ Employee updates ONLY employeeStatus
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/employee/${id}`, { employeeStatus: status });
      fetchMyTasks();

      toast.success(`🎯 Status updated to ${status}`, {
        autoClose: 2000,
        style: {
          background: "#ffffff",
          color: "#1e1e2f",
          borderLeft: "4px solid #22c55e",
        },
      });
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status");
    }
  };

  // ✅ Count tasks safely
  const counts = tasks.reduce((acc, t) => {
    const status = t.employeeStatus || "New";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // ✅ Delete task
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
    
      
    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 tracking-tight">
          Hey {user?.name || "Employee"} !
        </h1>

        <button
          onClick={logout}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
        >
          Logout
        </button>
      </div>

      {/* Task Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        {["New", "Active", "Completed", "Failed"].map((status) => (
          <div
            key={status}
            className="p-5 bg-white rounded-2xl text-center border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            <p className="text-gray-500 text-sm mb-1">{status}</p>
            <h3
              className={`text-2xl font-bold ${
                status === "New"
                  ? "text-blue-600"
                  : status === "Active"
                  ? "text-yellow-600"
                  : status === "Completed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {counts[status] || 0}
            </h3>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-2xl shadow ">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          📋 Your Assigned Tasks
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onUpdate={updateStatus}
                  onDelete={handleDelete}
                  role="employee"
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No tasks assigned yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
