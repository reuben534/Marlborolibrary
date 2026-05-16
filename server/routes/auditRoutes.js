import express from 'express';
import {
  getAuditLogs,
  getUserAuditLogs,
  getLoginHistory,
  getReportAccessHistory,
} from '../controllers/auditController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Get all audit logs (admin only)
router.get('/logs', protect, adminOnly, getAuditLogs);

// Get specific user's audit logs (admin only)
router.get('/logs/:userId', protect, adminOnly, getUserAuditLogs);

// Get recent login history (for reports page - admin only)
router.get('/login-history', protect, adminOnly, getLoginHistory);

// Get recent report access history (for reports page - admin only)
router.get('/report-history', protect, adminOnly, getReportAccessHistory);

export default router;
