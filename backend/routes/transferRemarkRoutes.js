import express from "express";
import { createTransferRemark, getTransferRemarks } from "../controllers/transferRemarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:transferRequestId", protect, getTransferRemarks);
router.post("/", protect, createTransferRemark);

export default router;
