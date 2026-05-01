import express from "express";
import { 
    getAllocatedPosts, 
    createAllocatedPost, 
    updateAllocatedPost, 
    deleteAllocatedPost 
} from "../controllers/allocatedPostController.js";

const router = express.Router();
router.get("/", getAllocatedPosts);


router.post("/", createAllocatedPost);


router.put("/:id", updateAllocatedPost);


router.delete("/:id", deleteAllocatedPost);

export default router;
