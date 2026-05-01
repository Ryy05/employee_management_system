import express from 'express';
import { getUserByOfficeId, getUserById } from '../controllers/userController.js';

const router = express.Router();
router.get('/office/:officeId', getUserByOfficeId);
router.get("/:userId", getUserById);

export default router;
