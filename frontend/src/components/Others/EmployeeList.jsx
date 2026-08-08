

import React, { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee, updateEmployeeDetails } from "../../utils/api.js";
import { exportToCSV } from "../../utils/csvExport.js";
import { toast } from "react-toastify";
import { Edit2, Trash2, Download } from "lucide-react";

const EmployeeList = ({ tasks = [] }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmp, setEditingEmp] = useState(null);

  const handleExportEmployees = () => {
    const dataToExport = employees.map((e) => {
      const empTasks = tasks.filter((t) => (t.assignedTo?._id || t.assignedTo) === e._id);
      const completed = empTasks.filter((t) => t.adminStatus === "Completed" || t.employeeStatus === "Completed").length;
      const rate = empTasks.length > 0 ? Math.round((completed / empTasks.length) * 100) : 100;

      return {
        Name: e.name,
        Email: e.email,
        Department: e.department || "General",
        Designation: e.designation || "Team Member",
        Phone: e.phone || "",
        TasksAssigned: empTasks.length,
        CompletionRate: `${rate}%`,
        Role: e.role,
      };
    });
    exportToCSV("employees_directory.csv", dataToExport);
    toast.success("Exported employee directory to CSV!");
  };

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
      toast.error("Failed to load employee list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete employee ${name}?`)) return;
    try {
      await deleteEmployee(id);
      toast.success("Employee deleted successfully!");
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.error || "Failed to delete employee");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateEmployeeDetails(editingEmp._id, {
        name: editingEmp.name,
        email: editingEmp.email,
        department: editingEmp.department,
        designation: editingEmp.designation,
        phone: editingEmp.phone,
      });

      toast.success(res.message || "Employee updated successfully!");
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === editingEmp._id ? res.employee : emp))
      );
      setEditingEmp(null);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.error || "Failed to update employee");
    }
  };

  if (loading) return <p className="text-center mt-5 text-gray-500 dark:text-slate-400">Loading employees...</p>;

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Employee Directory</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-medium border border-indigo-100 dark:border-indigo-900">
            Total Employees: {employees.length}
          </span>
          <button
            onClick={handleExportEmployees}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border border-gray-200 dark:border-slate-800 p-4 overflow-x-auto transition-colors">
        {employees.length === 0 ? (
          <p className="text-gray-600 dark:text-slate-400 text-center py-6">No employees found.</p>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 text-sm font-semibold border-b dark:border-slate-700">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              {employees.map((emp) => {
                const empTasks = tasks.filter((t) => (t.assignedTo?._id || t.assignedTo) === emp._id);
                const completedCount = empTasks.filter(
                  (t) => t.adminStatus === "Completed" || t.employeeStatus === "Completed"
                ).length;
                const scoreRate = empTasks.length > 0 ? Math.round((completedCount / empTasks.length) * 100) : 100;

                return (
                  <tr
                    key={emp._id}
                    className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-white">
                      {emp.name}
                      <span className="block text-xs text-gray-400 dark:text-slate-400 font-normal">
                        {emp.phone || "No phone"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-slate-300">{emp.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {emp.department || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 dark:text-slate-300">{emp.designation || "Team Member"}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            scoreRate >= 80
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                              : scoreRate >= 50
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                          }`}
                        >
                          ⭐ {scoreRate}% Score
                        </span>
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                          ({completedCount}/{empTasks.length})
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setEditingEmp(emp)}
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                          title="Edit Employee"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id, emp.name)}
                          className="p-1.5 text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Employee</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Name</label>
                <input
                  type="text"
                  value={editingEmp.name || ""}
                  onChange={(e) => setEditingEmp({ ...editingEmp, name: e.target.value })}
                  className="w-full border rounded-lg p-2.5 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                <input
                  type="email"
                  value={editingEmp.email || ""}
                  onChange={(e) => setEditingEmp({ ...editingEmp, email: e.target.value })}
                  className="w-full border rounded-lg p-2.5 mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Department</label>
                  <select
                    value={editingEmp.department || "Engineering"}
                    onChange={(e) => setEditingEmp({ ...editingEmp, department: e.target.value })}
                    className="w-full border rounded-lg p-2.5 mt-1 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="HR">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">Designation</label>
                  <input
                    type="text"
                    value={editingEmp.designation || ""}
                    onChange={(e) => setEditingEmp({ ...editingEmp, designation: e.target.value })}
                    className="w-full border rounded-lg p-2.5 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Phone</label>
                <input
                  type="tel"
                  value={editingEmp.phone || ""}
                  onChange={(e) => setEditingEmp({ ...editingEmp, phone: e.target.value })}
                  className="w-full border rounded-lg p-2.5 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

