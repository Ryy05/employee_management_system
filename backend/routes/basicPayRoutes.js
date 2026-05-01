import express from "express";
import {
  getBasicPays,
  createBasicPay,
  getBasicPayById,
  updateBasicPay,
  deleteBasicPay
} from "../controllers/basicPayController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBasicPays);
router.post("/", protect, isAdmin, createBasicPay);
router.get("/:id", protect, getBasicPayById);
router.put("/:id", protect, isAdmin, updateBasicPay);
router.delete("/:id", protect, isAdmin, deleteBasicPay);

export default router;
