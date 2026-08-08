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
    const { name, email, password, department, designation, phone } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const employee = new Employee({
      name,
      email,
      password: hashed,
      role: "employee",
      department: department || "Engineering",
      designation: designation || "Team Member",
      phone: phone || "",
    });
    await employee.save();

    const sanitizedEmployee = employee.toObject();
    delete sanitizedEmployee.password;

    res.json({ message: "Employee registered successfully", employee: sanitizedEmployee });
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

// 🔐 Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    const user = await Employee.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

