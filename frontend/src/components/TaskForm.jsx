

import React, { useState } from "react";

export default function TaskForm({ employees, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");

  const submit = (e) => {
    e.preventDefault();

    onCreate({
      title,
      description,
      assignedTo,
      deadline,
      adminStatus: "New",
      employeeStatus: "Not Started",
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDeadline("");
  };

  return (
    <form
      onSubmit={submit}
      className="p-6 bg-white rounded-2xl shadow border border-gray-200"
    >
      <div className="space-y-4">
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-3 border rounded-lg resize-none"
          placeholder="Task Description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="flex flex-col">
          <label htmlFor="deadline" className="mb-1 text-gray-700 font-medium">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            className="w-full p-3 border rounded-lg"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white"
          required
        >
          <option key="placeholder" value="">
            Assign to
          </option>
          {employees.map((emp) => (
            <option key={emp._id || emp.email} value={emp._id}>
              {emp.name} ({emp.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg"
        >
          Create Task
        </button>
      </div>
    </form>
  );
}
