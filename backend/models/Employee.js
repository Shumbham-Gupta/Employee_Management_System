import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    department: { type: String, default: "General" },
    designation: { type: String, default: "Team Member" },
    phone: { type: String, default: "" },
  },

  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
