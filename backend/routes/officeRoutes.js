import express from "express";
import {
  getOffices,
  createOffice,
  updateOffice,
  deleteOffice,
  getOfficeById 
} from "../controllers/officeController.js";

const router = express.Router();

router.get("/", getOffices);
router.post("/", createOffice);
router.put("/:officeId", updateOffice);
router.delete("/:officeId", deleteOffice);
router.get("/:officeId", getOfficeById);

export default router;
