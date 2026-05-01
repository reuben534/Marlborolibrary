import express from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, librarian, getStats);

export default router;
