import express from 'express';
import {
  getTransactions,
  borrowBook,
  returnBook,
  getMemberTransactions,
} from '../controllers/transactionController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, librarian, getTransactions);
router.post('/borrow', protect, librarian, borrowBook);
router.post('/return/:id', protect, librarian, returnBook);
router.get('/member/:memberId', protect, getMemberTransactions);

export default router;
