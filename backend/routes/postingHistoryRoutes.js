import express from "express";
import {
  getPostingHistoryByEmployee,
  createPostingHistory,
} from "../controllers/postingHistoryController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:employeeId", protect, getPostingHistoryByEmployee);
router.post("/", protect, authorizeRoles("admin", "CEO", "ZEO", "School"), createPostingHistory);

export default router;
