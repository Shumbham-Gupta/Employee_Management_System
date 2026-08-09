


import axios from "axios";

// ✅ Dynamic API Base URL using environment variable or hosted production backend fallback
const getBaseURL = () => {
  return (
    import.meta.env.VITE_API_URL ||
    "https://employee-management-system-backend-4e8s.onrender.com/api"
  );
};

const API = axios.create({
  baseURL: getBaseURL(),
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

export const updateEmployeeDetails = async (id, data) => {
  const res = await API.put(`/employees/${id}`, data);
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

export const updateTaskDetails = async (id, data) => {
  const res = await API.put(`/tasks/${id}`, data);
  return res.data;
};

export const addTaskComment = async (id, text) => {
  const res = await API.post(`/tasks/${id}/comments`, { text });
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

// Attendance
export const clockIn = async () => {
  const res = await API.post("/attendance/clock-in");
  return res.data;
};

export const clockOut = async () => {
  const res = await API.post("/attendance/clock-out");
  return res.data;
};

export const fetchMyAttendance = async () => {
  const res = await API.get("/attendance/my-attendance");
  return res.data;
};

export const fetchAllAttendance = async (date) => {
  const res = await API.get(`/attendance/all${date ? `?date=${date}` : ""}`);
  return res.data;
};

// Leaves
export const applyLeave = async (leaveData) => {
  const res = await API.post("/leaves/apply", leaveData);
  return res.data;
};

export const fetchMyLeaves = async () => {
  const res = await API.get("/leaves/my-leaves");
  return res.data;
};

export const fetchAllLeaves = async () => {
  const res = await API.get("/leaves/all");
  return res.data;
};

export const updateLeaveStatus = async (id, statusData) => {
  const res = await API.put(`/leaves/${id}/status`, statusData);
  return res.data;
};

export default API;

