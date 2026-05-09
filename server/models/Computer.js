import mongoose from 'mongoose';

const computerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    specifications: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'in-use', 'maintenance'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Computer = mongoose.model('Computer', computerSchema);
export default Computer;
