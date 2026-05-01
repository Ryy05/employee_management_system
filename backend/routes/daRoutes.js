import express from "express";
import {
  getDARecords,
  createDA,
  getDAById,
  updateDA,
  deleteDA
} from "../controllers/daController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDARecords);
router.post("/", protect, isAdmin, createDA);
router.get("/:id", protect, getDAById);
router.put("/:id", protect, isAdmin, updateDA);
router.delete("/:id", protect, isAdmin, deleteDA);

export default router;
