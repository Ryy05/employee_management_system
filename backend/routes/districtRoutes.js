import express from "express";
import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "../controllers/districtController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all districts - Accessible by all authenticated users
router.get("/", protect, getDistricts);

// Create a new district - Only accessible by CEO
router.post("/", protect, authorizeRoles("CEO"), createDistrict);

// Update a district - Only accessible by CEO
router.put("/:districtId", protect, authorizeRoles("CEO"), updateDistrict);

// Delete a district - Only accessible by CEO
router.delete("/:districtId", protect, authorizeRoles("CEO"), deleteDistrict);

export default router;
