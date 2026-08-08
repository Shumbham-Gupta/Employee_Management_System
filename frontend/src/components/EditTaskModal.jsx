import React, { useState, useEffect } from "react";
import { updateTaskDetails } from "../utils/api.js";
import { toast } from "react-toastify";
import { Edit3, X } from "lucide-react";

export default function EditTaskModal({ isOpen, onClose, task, employees = [], onTaskUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [adminStatus, setAdminStatus] = useState("New");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setAssignedTo(task.assignedTo?._id || task.assignedTo || "");
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "");
      setPriority(task.priority || "Medium");
      setAdminStatus(task.adminStatus || "New");
      setAttachmentUrl(task.attachmentUrl || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateTaskDetails(task._id, {
        title,
        description,
        assignedTo,
        deadline,
        priority,
        adminStatus,
        attachmentUrl,
      });

      toast.success(res.message || "Task updated successfully!");
      if (onTaskUpdated) onTaskUpdated(res.task);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-800 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Edit3 className="text-indigo-600 dark:text-indigo-400" size={22} /> Edit Task
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                Status
              </label>
              <select
                value={adminStatus}
                onChange={(e) => setAdminStatus(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="New">New</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                Reassign Employee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {employees.map((emp) => (
                  <option key={emp._id || emp.email} value={emp._id || emp.id}>
                    {emp.name} ({emp.department || "General"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
              Attachment Link (URL)
            </label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://figma.com/... or https://github.com/..."
              className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 mt-1 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
