import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByZone,
  getEmployeesByOffice,
} from "../controllers/employeeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * General Routes
 */
router.get("/", protect, getEmployees); // Get all employees
router.get("/:id", protect, getEmployeeById); // Get a specific employee by ID
router.post("/", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), createEmployee); // Create a new employee
router.put("/:id", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), updateEmployee); // Update an employee
router.delete("/:id", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), deleteEmployee); // Delete an employee

/**
 * Specific Routes
 */
router.get("/zone/:zoneId", protect, getEmployeesByZone); // Get all employees within a specific zone
router.get("/office/:officeId", protect, getEmployeesByOffice); // Get all employees within a specific office

export default router;
