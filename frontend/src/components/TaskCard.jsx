

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";

export default function TaskCard({ task, onUpdate, onDelete, role }) {
  // ✅ Strong protection
  if (!task || typeof task !== "object") {
    console.warn("TaskCard received undefined or invalid task:", task);
    return null;
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // ✅ Final status based on role
  const finalStatus =
    role === "admin"
      ? task.adminStatus || "New"
      : task.employeeStatus || "Not Started";

  const statusColors = {
    New: "bg-blue-100 text-blue-700",
    Active: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
    "Not Started": "bg-gray-200 text-gray-700",
    "In Progress": "bg-indigo-100 text-indigo-700",
  };

  // ✅ Safe date parsing
  const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();
  const deadlineDate = task.deadline ? new Date(task.deadline) : new Date();

  const today = new Date();
  const diffTime = deadlineDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let deadlineColor = "text-green-600 font-semibold";
  if (daysLeft < 0) deadlineColor = "text-red-700 font-bold";
  else if (daysLeft <= 1) deadlineColor = "text-red-500 font-bold";
  else if (daysLeft <= 3) deadlineColor = "text-orange-500 font-semibold";
  else if (daysLeft <= 7) deadlineColor = "text-yellow-600 font-semibold";

  // ✅ Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative p-5 bg-white rounded-2xl shadow border">

      {/* ✅ ADMIN MENU */}
      {role === "admin" && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border shadow rounded-xl py-2 z-10">
              <button
                onClick={() => onDelete(task._id)}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* ✅ Task Info Section */}
      <div className="flex justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>

          <p className="text-xs text-gray-400">
            Created: {createdDate.toLocaleDateString()}
          </p>

          <p className={`text-xs mt-1 ${deadlineColor}`}>
            Deadline: {deadlineDate.toLocaleDateString()} •{" "}
            {daysLeft < 0
              ? `${Math.abs(daysLeft)} days overdue`
              : `${daysLeft} days left`}
          </p>
        </div>

        {/* ✅ Final Status Display */}
        <div className="text-right">
          <span
            className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full mr-8 ${statusColors[finalStatus]}`}
          >
            {finalStatus}
          </span>

          <p className="text-sm font-medium text-gray-700 mt-3">
            {task.assignedTo?.name || "Unassigned"}
          </p>
        </div>
      </div>

      {/* ✅ Status Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["New", "Active", "Completed", "Failed"].map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(task._id, s)}
            className={`px-3 py-1 text-sm rounded-lg border transition ${
              finalStatus === s
                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

    </div>
  );
}
