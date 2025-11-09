import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🧑‍💼 Admin registration (already exists)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const admin = new Employee({ name, email, password: hashed, role: "admin" });
    await admin.save();
    res.json({ message: "Admin registered" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 👷 Employee registration (NEW)
export const registerEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const employee = new Employee({ name, email, password: hashed, role: "employee" });
    await employee.save();
    res.json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔐 Login (already exists)
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Employee.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user });
};

// 👥 Get all employees (NEW)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
