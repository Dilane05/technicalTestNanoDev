import { Router } from 'express';
import {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByDateRange,
} from '../controllers/transactionController';

const router = Router();

router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.get('/transactions', getAllTransactions);
router.get('/transactions/date-range', getTransactionsByDateRange);
router.get('/transactions/:id', getTransactionById);

export default router;