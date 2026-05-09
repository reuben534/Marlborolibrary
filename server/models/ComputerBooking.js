import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    computer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Computer',
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    purpose: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ComputerBooking = mongoose.model('ComputerBooking', bookingSchema);
export default ComputerBooking;
