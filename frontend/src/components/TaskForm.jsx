import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function TaskForm({ employees = [], onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({
        title,
        description,
        assignedTo,
        deadline,
        priority,
        attachmentUrl,
        adminStatus: "New",
        employeeStatus: "Not Started",
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDeadline("");
      setPriority("Medium");
      setAttachmentUrl("");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Task Title *
        </label>
        <input
          className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
          placeholder="e.g. Design Landing Page UI"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Task Description *
        </label>
        <textarea
          className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 resize-none transition"
          placeholder="Describe requirements and deliverables..."
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Deadline & Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="deadline" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
            Deadline *
          </label>
          <input
            id="deadline"
            type="date"
            className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
            Priority Level
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
          >
            <option value="Low">🔵 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🟠 High</option>
            <option value="Urgent">🔴 Urgent</option>
          </select>
        </div>
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Assign To Employee *
        </label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
          required
        >
          <option key="placeholder" value="">
            Select Employee...
          </option>
          {employees.map((emp) => (
            <option key={emp._id || emp.email} value={emp._id || emp.id}>
              {emp.name} ({emp.department || "General"})
            </option>
          ))}
        </select>
      </div>

      {/* Attachment Link */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Attachment Link (Optional)
        </label>
        <input
          type="url"
          className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
          placeholder="https://figma.com/file/... or https://github.com/..."
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
        />
      </div>


      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
      >
        <PlusCircle size={18} /> {submitting ? "Creating Task..." : "Create & Assign Task"}
      </button>
    </form>
  );
}
