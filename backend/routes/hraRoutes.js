import express from "express";
import {
  getHRARecords,
  createHRA,
  getHRAById,
  updateHRA,
  deleteHRA
} from "../controllers/hraController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("CEO", "ZEO", "School"), getHRARecords);

router.post("/", protect, authorizeRoles("CEO", "ZEO", "School"), createHRA);

router.get("/:id", protect, authorizeRoles("CEO", "ZEO", "School"), getHRAById);

router.put("/:id", protect, authorizeRoles("CEO", "ZEO", "School"), updateHRA);

router.delete("/:id", protect, authorizeRoles("CEO", "ZEO", "School"), deleteHRA);

export default router;
