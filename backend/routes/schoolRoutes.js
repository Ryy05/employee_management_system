import express from "express";
import {
  getAllSchools,
  getSchoolById,
  getMySchool,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByZoneId,
  getSchoolsByOfficeId,
  getSchoolsByDistrictId,
} from "../controllers/schoolController.js";

const router = express.Router();

// General school operations
router.get("/", getAllSchools);
router.get("/:id", getSchoolById);
router.get("/myschool", getMySchool);
router.post("/", createSchool);
router.put("/:id", updateSchool);
router.delete("/:id", deleteSchool);

// New specific routes
router.get("/zone/:zoneId", getSchoolsByZoneId);
router.get("/office/:officeId", getSchoolsByOfficeId);
router.get("/district/:districtId", getSchoolsByDistrictId);

export default router;
