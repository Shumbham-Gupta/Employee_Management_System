

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createTask, fetchEmployees } from "../../utils/api";

const CreateTask = () => {
  const { user } = useContext(AuthContext); // Current admin user (optional)
  const [employees, setEmployees] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");

  // ✅ Fetch employees once on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data || []);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    loadEmployees();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!taskAssignTo) return alert("Please select an employee.");

    try {
      // Convert deadline to end-of-day to avoid past date errors
      const deadlineDate = new Date(taskDeadline + "T23:59:59");

      const newTask = {
        title: taskTitle,
        description: taskDescription,
        assignedTo: taskAssignTo, // ObjectId of employee
        deadline: deadlineDate,
        adminStatus: "New",       // Optional, backend defaults to "New"
        employeeStatus: "Not Started", // Optional, backend defaults
      };

      await createTask(newTask);

      // ✅ Reset form
      setTaskTitle("");
      setTaskDescription("");
      setTaskDeadline("");
      setTaskAssignTo("");

      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Check console.");
    }
  };

  return (
    <div className="flex justify-center items-center p-6">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Create Task
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Title */}
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            type="text"
            placeholder="Task Title"
            className="p-3 border rounded-lg w-full"
            required
          />

          {/* Deadline */}
          <input
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            type="date"
            className="p-3 border rounded-lg w-full"
            required
          />

          {/* Assign To */}
          <select
            value={taskAssignTo}
            onChange={(e) => setTaskAssignTo(e.target.value)}
            className="p-3 border rounded-lg w-full"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
          className="p-3 border rounded-lg w-full"
          rows="4"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 w-full"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
