
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

// ✅ Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).select("-password");
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, designation, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Employee already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      name,
      email,
      password: hashed,
      role: "employee",
      department: department || "General",
      designation: designation || "Team Member",
      phone: phone || "",
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        _id: newEmployee._id,
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        department: newEmployee.department,
        designation: newEmployee.designation,
        phone: newEmployee.phone,
      },
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update employee details
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, designation, phone } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;
    if (phone !== undefined) employee.phone = phone;

    await employee.save();
    res.json({
      message: "Employee updated successfully",
      employee: {
        _id: employee._id,
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        designation: employee.designation,
        phone: employee.phone,
      },
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};

