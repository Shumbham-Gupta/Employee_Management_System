


import axios from "axios";

const API = axios.create({
  baseURL: "https://employee-management-system-backend-part.onrender.com/api",
});

// ✅ Attach Token Automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("ttoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Employees
export const createEmployee = async (employeeData) => {
  const res = await API.post("/employees", employeeData);
  return res.data; // Should return { message: "...", employee: {...} }
};

export const fetchEmployees = async () => {
  const res = await API.get("/employees");
  return res.data; // array of employees
};

export const deleteEmployee = async (id) => {
  const res = await API.delete(`/employees/${id}`);
  return res.data;
};

// Tasks
export const fetchTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

export const createTask = async (task) => {
  const res = await API.post("/tasks", task);
  return res.data;
};

// ✅ Admin updates ONLY adminStatus
export const updateAdminStatus = async (id, adminStatus) => {
  const res = await API.put(`/tasks/admin/${id}`, { adminStatus });
  return res.data;
};

// ✅ Employee updates ONLY employeeStatus
export const updateEmployeeStatus = async (id, employeeStatus) => {
  const res = await API.put(`/tasks/employee/${id}`, { employeeStatus });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};

export default API;
