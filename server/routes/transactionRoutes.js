import express from 'express';
import {
  getTransactions,
  borrowBook,
  returnBook,
  getMemberTransactions,
  requestBorrow,
  approveBorrow,
  rejectBorrow,
  getPendingTransactions,
  getMyTransactions,
} from '../controllers/transactionController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, librarian, getTransactions);
router.post('/borrow', protect, librarian, borrowBook);
router.post('/return/:id', protect, librarian, returnBook);
router.get('/member/:memberId', protect, getMemberTransactions);

// New Request/Approval workflow
router.get('/my-history', protect, getMyTransactions);
router.post('/request', protect, requestBorrow);
router.post('/approve/:id', protect, librarian, approveBorrow);
router.post('/reject/:id', protect, librarian, rejectBorrow);
router.get('/pending', protect, librarian, getPendingTransactions);

export default router;
