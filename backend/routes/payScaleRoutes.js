import express from "express";
import { 
    getPayScales, 
    createPayScale, 
    getPayScaleById, 
    updatePayScale, 
    deletePayScale 
} from "../controllers/payScaleController.js";

const router = express.Router();

router.get("/", getPayScales);

router.post("/", createPayScale);

router.get("/:id", getPayScaleById);

router.put("/:id", updatePayScale);

router.delete("/:id", deletePayScale);

export default router;
