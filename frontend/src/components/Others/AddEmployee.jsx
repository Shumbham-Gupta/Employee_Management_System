


import React, { useState } from "react";
import { toast } from "react-toastify";
import { createEmployee } from "../../utils/api.js";

const AddEmployee = ({ onAddEmployee }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.info("Creating employee...", { autoClose: false });

    try {
      const result = await createEmployee({ name, email, password });

      toast.dismiss(loadingToast);
      toast.success(result.message || "Employee created successfully!");

      if (onAddEmployee && result.employee) {
        onAddEmployee(result.employee); // ✅ Add employee instantly to TaskForm
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Error adding employee:", err);
      toast.error(err.response?.data?.error || "Failed to create employee!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border mb-6 w-full hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out">
      <form onSubmit={handleAddEmployee} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-xl p-3 outline-none focus:ring focus:ring-blue-200 placeholder-gray-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-3 outline-none focus:ring focus:ring-blue-200 placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-3 outline-none focus:ring focus:ring-blue-200 placeholder-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl w-full shadow-md transition-all duration-200"
        >
          {loading ? "Creating..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
