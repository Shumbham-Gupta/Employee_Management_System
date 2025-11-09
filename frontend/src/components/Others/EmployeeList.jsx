

import React, { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee } from "../../utils/api.js";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;

    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      alert("Employee deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete employee");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading employees...</p>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">Employee List</h2>

      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                      border border-gray-200 p-4 overflow-x-auto">

        {employees.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No employees found.</p>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-800">{emp.name}</td>
                  <td className="py-3 px-4 text-gray-700">{emp.email}</td>
                  <td className="py-3 px-4 capitalize text-gray-700">
                    {emp.role}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(emp._id, emp.name)}
                      className="px-4 py-2 rounded-lg text-white bg-red-600 
                                 hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Responsiveness NOTE */}
      <p className="text-xs text-gray-500 mt-2">
        * Scroll horizontally on smaller screens.
      </p>
    </div>
  );
};

export default EmployeeList;
