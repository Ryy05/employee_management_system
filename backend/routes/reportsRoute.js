import { getEmployeeReport, getSchoolReport } from "../controllers/reportController.js";

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/employees", protect, getEmployeeReport);
router.get("/schools", protect, getSchoolReport);

export default router;