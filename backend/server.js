// import employeeRoutes from "./routes/employee.routes.js";
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";
// import taskRoutes from "./routes/task.routes.js";

// dotenv.config();
// connectDB();

// const app = express();
// const frontendUrl="https://employee-management-system-frontend-5opl.onrender.com";
// app.use(cors({
//   origin: frontendUrl,
//   credentials: true
// }));

// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/employees", employeeRoutes);

import employeeRoutes from "./routes/employee.routes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();
connectDB();

const app = express();

const frontendURL = "https://employee-management-system-frontend-5opl.onrender.com"; // frontend URL
app.use(cors({
  origin: frontendURL,
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/employees", employeeRoutes);

// ✅ Only one app.listen
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
