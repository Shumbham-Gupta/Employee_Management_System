

import Task from "../models/Task.js";

// ✅ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ error: "Title and assignedTo are required" });
    }

    // ✅ Robust deadline validation
    if (!deadline || isNaN(Date.parse(deadline))) {
      return res.status(400).json({ error: "Invalid or missing deadline" });
    }

    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ error: "Deadline cannot be in the past" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      deadline,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET TASKS
export const getTasks = async (req, res) => {
  try {
    const { userId, role } = req.query;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    let tasks;

    if (role === "admin") {
      tasks = await Task.find().populate("assignedTo");
    } else if (role === "employee") {
      tasks = await Task.find({ assignedTo: userId }).populate("assignedTo");
    } else {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ ADMIN UPDATES ADMIN STATUS ONLY
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminStatus } = req.body;

    if (!adminStatus) {
      return res.status(400).json({ error: "adminStatus is required" });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { adminStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Task not found" });

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ EMPLOYEE UPDATES EMPLOYEE STATUS ONLY
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeStatus } = req.body;

    if (!employeeStatus) {
      return res.status(400).json({ error: "employeeStatus is required" });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { employeeStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Task not found" });

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
