import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Edit2, ExternalLink, MessageSquare, Send } from "lucide-react";
import { addTaskComment } from "../utils/api.js";
import { toast } from "react-toastify";

export default function TaskCard({ task, onUpdate, onDelete, onEdit, role }) {
  if (!task || typeof task !== "object") {
    console.warn("TaskCard received undefined or invalid task:", task);
    return null;
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(task.comments || []);
  const [postingComment, setPostingComment] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    setComments(task.comments || []);
  }, [task.comments]);

  const finalStatus =
    role === "admin"
      ? task.adminStatus || "New"
      : task.employeeStatus || "Not Started";

  const statusColors = {
    New: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    Active: "bg-yellow-100 text-yellow-700 dark:bg-amber-950/60 dark:text-amber-300",
    Completed: "bg-green-100 text-green-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    Failed: "bg-red-100 text-red-700 dark:bg-rose-950/60 dark:text-rose-300",
    "Not Started": "bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300",
    "In Progress": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  };

  const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();
  const deadlineDate = task.deadline ? new Date(task.deadline) : new Date();

  const today = new Date();
  const diffTime = deadlineDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let deadlineColor = "text-green-600 dark:text-emerald-400 font-semibold";
  if (daysLeft < 0) deadlineColor = "text-red-600 dark:text-rose-400 font-bold";
  else if (daysLeft <= 1) deadlineColor = "text-red-500 dark:text-rose-400 font-bold";
  else if (daysLeft <= 3) deadlineColor = "text-orange-500 dark:text-amber-400 font-semibold";
  else if (daysLeft <= 7) deadlineColor = "text-yellow-600 dark:text-amber-300 font-semibold";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPostingComment(true);
    try {
      const res = await addTaskComment(task._id, commentText);
      toast.success("Comment added!");
      setComments(res.task.comments || []);
      setCommentText("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  const statusOptions =
    role === "admin"
      ? ["New", "Active", "Completed", "Failed"]
      : ["Not Started", "In Progress", "Completed"];

  const priorityColors = {
    Urgent: "bg-red-100 dark:bg-rose-950/60 text-red-700 dark:text-rose-300 border-red-200 dark:border-rose-900",
    High: "bg-orange-100 dark:bg-amber-950/60 text-orange-700 dark:text-amber-300 border-orange-200 dark:border-amber-900",
    Medium: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    Low: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <div className="relative p-5 bg-white dark:bg-slate-900 rounded-2xl shadow border border-gray-200 dark:border-slate-800 transition-colors">
      {/* ADMIN MENU */}
      {role === "admin" && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-xl py-2 z-10 divide-y divide-gray-100 dark:divide-slate-700">
              {onEdit && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="flex items-center w-full gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700/60"
                >
                  <Edit2 size={14} className="text-indigo-600 dark:text-indigo-400" /> Edit Task
                </button>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task._id);
                }}
                className="flex items-center w-full gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 size={14} /> Delete Task
              </button>
            </div>
          )}
        </div>
      )}

      {/* Task Info Section */}
      <div className="flex justify-between mb-3">
        <div className="pr-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{task.title}</h3>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                priorityColors[task.priority] || priorityColors["Medium"]
              }`}
            >
              {task.priority || "Medium"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">{task.description}</p>

          <p className="text-xs text-gray-400 dark:text-slate-400">
            Created: {createdDate.toLocaleDateString("en-US")}
          </p>

          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            👤 Assigned To: {task.assignedTo?.name || "Unassigned"}
          </p>

          {/* Attachment Link Button */}
          {task.attachmentUrl && (
            <a
              href={task.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 rounded-lg hover:bg-indigo-100 transition"
            >
              <ExternalLink size={13} /> View Attachment
            </a>
          )}
        </div>
      </div>

      {/* Deadline Info */}
      {task.deadline && (
        <p className={`text-xs mt-2 ${deadlineColor}`}>
          📅 Deadline: {deadlineDate.toLocaleDateString("en-US")}{" "}
          {daysLeft < 0
            ? `(Overdue by ${Math.abs(daysLeft)} days)`
            : daysLeft === 0
            ? "(Due Today)"
            : `(${daysLeft} days left)`}
        </p>
      )}

      {/* Status & Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 dark:text-slate-400">Update Status:</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              statusColors[finalStatus] || "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
            }`}
          >
            {finalStatus}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => onUpdate(task._id, s)}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition ${
                finalStatus === s
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Comments & Updates Section Toggle */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <MessageSquare size={14} /> Comments & Updates ({comments.length})
        </button>

        {showComments && (
          <div className="mt-3 space-y-3 bg-gray-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-200 dark:border-slate-800">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-slate-500 italic">No comments or updates yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {comments.map((c, i) => (
                  <div key={c._id || i} className="text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-800 dark:text-slate-200">
                        {c.sender?.name || "User"}
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 ml-1">
                          ({c.sender?.role || "member"})
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handlePostComment} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Write an update or comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs p-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={postingComment}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow transition"
              >
                <Send size={12} /> Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
