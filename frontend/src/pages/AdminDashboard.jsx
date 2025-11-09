

import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import API, { deleteTask } from "../utils/api";
import AddEmployee from "../components/Others/AddEmployee";
import EmployeeList from "../components/Others/EmployeeList";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Fetch tasks
  const fetchAll = async () => {
    try {
      const res = await API.get("/tasks?role=admin");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees").catch(() => ({ data: [] }));
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchAll();
    fetchEmployees();
  }, []);

  // Create task
  const createTask = async (payload) => {
    try {
      await API.post("/tasks", payload);
      toast.success("Task created successfully!");
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Error creating task");
    }
  };

  // Update task status
  const updateStatus = async (id, adminStatus) => {
    try {
      await API.put(`/tasks/admin/${id}`, { adminStatus });
      toast.success("Task status updated!");
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Add employee instantly to dropdown
  const addEmployeeToList = (employee) => {
    setEmployees((prev) => [...prev, employee]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 tracking-tight">
          Hello Admin !
        </h1>
        <button
          onClick={logout}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              📝 Create New Task
            </h2>
            <TaskForm employees={employees} onCreate={createTask} />
          </div>

          {/* Add Employee */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mt-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              👤 Add New Employee
            </h2>
            <AddEmployee onAddEmployee={addEmployeeToList} />
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              📋 All Assigned Tasks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.length > 0 ? (
                [...tasks]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onUpdate={updateStatus}
                      onDelete={handleDelete}
                      role="admin"
                    />
                  ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No tasks available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmployeeList />
    </div>
  );
};

export default AdminDashboard;
