import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userFullName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ['admin', 'librarian', 'member'],
      required: true,
    },
    action: {
      type: String,
      enum: ['LOGIN', 'LOGOUT', 'REPORT_ACCESS', 'REPORT_DOWNLOAD'],
      required: true,
    },
    reportType: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
