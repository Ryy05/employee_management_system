import express from "express";
import {
  getTransferRequests,
  createTransferRequest,
  approveTransferRequest,
  respondToTransferRequest,
} from "../controllers/transferController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getTransferRequests); 
router.post("/", protect,  createTransferRequest);
router.put("/:id/approve", protect,  approveTransferRequest);
router.put("/:id/respond", protect,  respondToTransferRequest);

export default router;
