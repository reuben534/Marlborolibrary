import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// Helper function to create audit log
export const createAuditLog = async (userId, userFullName, userRole, action, reportType = null, description) => {
  try {
    const auditLog = new AuditLog({
      userId,
      userFullName,
      userRole,
      action,
      reportType,
      description,
    });
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging shouldn't break main functionality
  }
};

// Get all audit logs (admin only)
export const getAuditLogs = asyncHandler(async (req, res) => {
  // Admin-only check should be done in route middleware
  const { limit = 100, skip = 0, userId, action, startDate, endDate } = req.query;

  let filter = {};

  if (userId) {
    filter.userId = userId;
  }

  if (action) {
    filter.action = action;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  const logs = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .populate('userId', 'username fullName email');

  const total = await AuditLog.countDocuments(filter);

  res.json({
    logs,
    total,
    limit: parseInt(limit),
    skip: parseInt(skip),
  });
});

// Get audit logs for specific user
export const getUserAuditLogs = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit = 50, skip = 0 } = req.query;

  const logs = await AuditLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  res.json(logs);
});

// Get login history (simplified for reports page)
export const getLoginHistory = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find({ action: 'LOGIN' })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(logs);
});

// Get report access history
export const getReportAccessHistory = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find({
    $or: [{ action: 'REPORT_ACCESS' }, { action: 'REPORT_DOWNLOAD' }],
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(logs);
});
