import express from "express";
import { getLogs, getLocalStats, getLastLogin, getLogsForZone, getLogsForOffice } from "../controllers/logController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), getLogs);
router.get("/stats", protect, authorizeRoles("CEO", "ZEO", "schoolAdmin"), getLocalStats);
router.get("/user/:username/last-login", getLastLogin);
router.get("/zone/:zoneId", getLogsForZone);
router.get("/office/:officeId", getLogsForOffice);

export default router;
