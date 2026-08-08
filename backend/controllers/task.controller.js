

import Task from "../models/Task.js";

// ✅ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority, attachmentUrl } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ error: "Title and assignedTo are required" });
    }

    // ✅ Robust deadline validation
    if (!deadline || isNaN(Date.parse(deadline))) {
      return res.status(400).json({ error: "Invalid or missing deadline" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      deadline,
      priority: priority || "Medium",
      attachmentUrl: attachmentUrl || "",
    });

    await task.save();
    const populated = await Task.findById(task._id).populate("assignedTo", "name email role department designation");
    res.status(201).json({ message: "Task created successfully", task: populated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE FULL TASK DETAILS
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, deadline, priority, adminStatus, employeeStatus, attachmentUrl } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (deadline) task.deadline = deadline;
    if (priority) task.priority = priority;
    if (adminStatus) task.adminStatus = adminStatus;
    if (employeeStatus) task.employeeStatus = employeeStatus;
    if (attachmentUrl !== undefined) task.attachmentUrl = attachmentUrl;

    await task.save();
    const populated = await Task.findById(id).populate("assignedTo", "name email role department designation");
    res.json({ message: "Task updated successfully", task: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET TASKS
export const getTasks = async (req, res) => {
  try {
    const role = req.user?.role || req.query.role;
    const userId = req.user?.id || req.query.userId;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    let tasks;

    if (role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email role department designation")
        .populate("comments.sender", "name role department");
    } else if (role === "employee") {
      tasks = await Task.find({ assignedTo: userId })
        .populate("assignedTo", "name email role department designation")
        .populate("comments.sender", "name role department");
    } else {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    res.json(tasks);

  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ ADD TASK COMMENT
export const addTaskComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const senderId = req.user?.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text cannot be empty" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.comments.push({
      sender: senderId,
      text: text.trim(),
      createdAt: new Date(),
    });

    await task.save();

    const populatedTask = await Task.findById(id)
      .populate("assignedTo", "name email role department designation")
      .populate("comments.sender", "name role department");

    res.status(201).json({ message: "Comment added successfully", task: populatedTask });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ ADMIN UPDATES ADMIN STATUS ONLY
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminStatus } = req.body;

    const validStatuses = ["New", "Active", "Completed", "Failed"];
    if (!adminStatus || !validStatuses.includes(adminStatus)) {
      return res.status(400).json({ error: `Invalid adminStatus. Must be one of: ${validStatuses.join(", ")}` });
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

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!employeeStatus || !validStatuses.includes(employeeStatus)) {
      return res.status(400).json({ error: `Invalid employeeStatus. Must be one of: ${validStatuses.join(", ")}` });
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
