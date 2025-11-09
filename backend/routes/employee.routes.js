// import express from "express";
// import { getEmployees, createEmployee } from "../controllers/employee.controller.js";

// const router = express.Router();

// router.get("/", getEmployees);
// router.post("/", createEmployee);

// export default router;
import express from "express";
import {
  getEmployees,
  createEmployee,
  deleteEmployee
} from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/", getEmployees);
router.post("/", createEmployee);

// ✅ New Route: Delete employee by ID
router.delete("/:id", deleteEmployee);

export default router;
