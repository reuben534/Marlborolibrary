import express from 'express';
import { getReportStats, exportReport } from '../controllers/reportController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, librarian, getReportStats);
router.get('/export/:type', protect, librarian, exportReport);

export default router;
