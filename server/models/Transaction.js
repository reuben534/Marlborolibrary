import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'returned', 'overdue', 'rejected'],
      default: 'active',
    },
    fine: {
      type: Number,
      default: 0,
    },
    condition: {
      type: String,
      enum: ['Good', 'Fair', 'Damaged'],
      default: 'Good',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
