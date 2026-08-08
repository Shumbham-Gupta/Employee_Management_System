import Leave from "../models/Leave.js";

// 📝 APPLY FOR LEAVE (Employee)
export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Start date, End date, and Reason are required" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ error: "End date cannot be before Start date" });
    }

    const leave = await Leave.create({
      employee: userId,
      leaveType: leaveType || "Casual Leave",
      startDate,
      endDate,
      reason,
      status: "Pending",
    });

    res.status(201).json({ message: "Leave application submitted successfully", leave });
  } catch (err) {
    console.error("Apply leave error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📂 GET MY LEAVES (Employee)
export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await Leave.find({ employee: userId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 GET ALL LEAVES (Admin)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email department designation")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⚙️ UPDATE LEAVE STATUS (Admin - Approve / Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid leave status" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    leave.status = status;
    if (adminComment !== undefined) leave.adminComment = adminComment;

    await leave.save();
    const populated = await Leave.findById(id).populate("employee", "name email department designation");

    res.json({ message: `Leave application ${status.toLowerCase()}`, leave: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
