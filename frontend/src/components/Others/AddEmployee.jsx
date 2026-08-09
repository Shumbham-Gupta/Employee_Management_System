import React, { useState } from "react";
import { toast } from "react-toastify";
import { createEmployee } from "../../utils/api.js";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const AddEmployee = ({ onAddEmployee }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("Team Member");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Name, Email, and Password are required!");
      return;
    }

    setLoading(true);
    try {
      const result = await createEmployee({ name, email, password, department, designation, phone });

      toast.success(result.message || "Employee created successfully!");

      if (onAddEmployee && result.employee) {
        onAddEmployee(result.employee);
      }

      setName("");
      setEmail("");
      setPassword("");
      setDepartment("Engineering");
      setDesignation("Team Member");
      setPhone("");
    } catch (err) {
      console.error("Error adding employee:", err);
      toast.error(err.response?.data?.error || "Failed to create employee!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddEmployee} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Full Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Sarah Jenkins"
          className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Email Address *
        </label>
        <input
          type="email"
          placeholder="sarah@company.com"
          className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Initial Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 pr-10 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>


      {/* Department & Designation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
            disabled={loading}
          >
            <option value="Engineering">💻 Engineering</option>
            <option value="HR">👥 Human Resources</option>
            <option value="Sales">📈 Sales</option>
            <option value="Marketing">📢 Marketing</option>
            <option value="Design">🎨 Design</option>
            <option value="Finance">💰 Finance</option>
            <option value="Operations">⚙️ Operations</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
            Designation
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Developer"
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-slate-500 transition"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
      >
        <UserPlus size={18} /> {loading ? "Creating Employee..." : "Register Employee Account"}
      </button>
    </form>
  );
};

export default AddEmployee;
