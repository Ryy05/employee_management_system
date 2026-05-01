import express from 'express';
import {
  getPayCommissions,
  createPayCommission,
  updatePayCommission,
  deletePayCommission,
} from '../controllers/payCommissionController.js';

const router = express.Router();

router.get('/', getPayCommissions);
router.post('/', createPayCommission);
router.put('/:id', updatePayCommission);
router.delete('/:id', deletePayCommission);

export default router;
