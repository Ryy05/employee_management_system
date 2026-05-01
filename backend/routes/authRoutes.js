import express from "express";
import {
  loginUser,
  updatePassword,
  registerSchoolAdmin,
  registerStaff,
  registerZonalAdmin
} from "../controllers/authController.js";
import { protect, isCEO, isZEO, isSchoolAdmin, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/login", loginUser);

// Protected Routes - User must be authenticated
router.put("/update-password", protect, updatePassword);

// Registration Routes (Protected & Role-based)
router.post("/register-school-admin", protect, authorizeRoles("CEO", "ZEO"), registerSchoolAdmin);
router.post("/register-staff", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), registerStaff);
router.post("/register-zonal-admin", protect, isCEO, registerZonalAdmin); // Only CEO can register Zonal Admins

export default router;
