
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "employee_photos", 
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});


const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "transfer_orders", 
    resource_type: "raw", 
    allowed_formats: ["pdf"],
  },
});

const uploadPDF = multer({ storage: pdfStorage });


const parser = multer({ storage });

const router = express.Router();

router.post("/", parser.single("file"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});

router.post("/upload-transfer-order", uploadPDF.single("transferOrder"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ url: req.file.path }); 
});


export default router;
