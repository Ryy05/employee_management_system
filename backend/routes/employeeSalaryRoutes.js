import express from "express";
import {
  getEmployeeSalaries,
  createEmployeeSalary,
  getEmployeeSalaryById,
  updateEmployeeSalary,
  deleteEmployeeSalary,
} from "../controllers/employeeSalariesController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("CEO", "ZEO", "School"), getEmployeeSalaries);

router.post("/", protect, authorizeRoles("CEO", "ZEO", "School"), createEmployeeSalary);

router.get("/:id", protect, authorizeRoles("CEO", "ZEO", "School"), getEmployeeSalaryById);

router.put("/:id", protect, authorizeRoles("CEO", "ZEO", "School"), updateEmployeeSalary);

router.delete("/:id", protect, authorizeRoles("CEO", "ZEO", "School"), deleteEmployeeSalary);

export default router;
