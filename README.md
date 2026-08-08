# TaskInfus — Enterprise Employee Management System (MERN Stack)

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_19_--_Vite-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js_--_Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwindcss)

TaskInfus EMS is a full-stack **Employee Management System** built with MongoDB, Express.js, React 19, Node.js, and Tailwind CSS v4. It features real-time Role-Based Access Control (RBAC), task allocation with priority tags, interactive clock in/out attendance logging, leave approval workflows, executive analytics, dark/light theme switching, and 1-click CSV data exports.

---

## 🌟 Key Features

### 🧑‍💼 Admin / Superadmin Capabilities
- **Executive Analytics Overview**: KPI metrics cards for Total Employees, Active Tasks, Task Completion Rate %, and Attention Alerts.
- **Department Workload Breakdown**: Visual bar graph comparing task volume across `Engineering`, `HR`, `Sales`, `Marketing`, `Design`, `Finance`, and `Operations`.
- **Task Lifecycle & Allocation**: Create, edit, search, filter (by status & priority), sort, reassign, and delete tasks.
- **Employee Directory & Performance**: Register new employee accounts, view contact details, edit profiles, and track calculated **⭐ Employee Performance Scorecard badges**.
- **Leave Request Management**: Review employee leave applications with `⏳ Pending`, `✅ Approved`, and `❌ Rejected` filter tabs.
- **Company-Wide Attendance Logs**: Monitor daily shift clock-in times, clock-out times, total hours worked, and punctuality badges (`Present`, `Late`).
- **One-Click CSV Data Exports**: Generate downloadable CSV reports for Tasks, Employee Directory, Leave Requests, and Attendance Logs.

### 👷 Employee Portal
- **Interactive Daily Attendance**: Clock In & Clock Out widget with shift status and automatic working hours logger.
- **Assigned Tasks Hub**: Real-time task search, status dropdown updates (`Not Started`, `In Progress`, `Completed`), and external attachment links.
- **Leave Application Modal**: Submit leave requests (`Casual`, `Sick`, `Paid`, `Unpaid`) with date validation and status history tracking.

### 🔐 Security & Polish
- **JWT & Role Authorization Middleware**: Secure token signature verification (`verifyToken`) and Admin role protection (`verifyAdmin`).
- **API Rate Limiting**: Protection against DDoS and brute-force login attempts (`express-rate-limit`).
- **1-Click Quick Demo Login Shortcuts**: Pre-configured demo login buttons on the login page for effortless testing.
- **Dark / Light Theme System**: Global theme provider with persistent `localStorage` preference.

---

## 🔑 Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin Portal** | `admin@ems.com` | `admin123` |
| **Employee Portal** | `employee@ems.com` | `employee123` |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Toastify, Framer Motion
- **Backend**: Node.js, Express 5, Mongoose 8, JWT, bcryptjs, Express Rate Limit
- **Database**: MongoDB Atlas Cloud Database

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas URI or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `backend/.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ems_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Run seed script to populate default Admin & Employee credentials:
```bash
node seedAdmin.js
```

Start backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend Vite server:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend App**: `http://localhost:5173/`
- **Backend API**: `http://localhost:5000/api/`

---

## 🧪 Production Build & Deployment

### Build Frontend Bundle
```bash
cd frontend
npm run build
```

### Deploying to Render / Vercel
1. **Frontend (Vercel / Render Static Site)**: Set Build Command to `npm run build` and Publish Directory to `dist`. Configure `VITE_API_URL` to point to your live backend domain.
2. **Backend (Render Web Service)**: Set Start Command to `npm start`. Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT` environment variables.

---

## 📜 License
This project is licensed under the MIT License.
