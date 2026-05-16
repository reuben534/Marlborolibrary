import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    copies: {
      type: Number,
      default: 1,
    },
    available: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['available', 'low', 'unavailable'],
      default: 'available',
    },
    coverImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update status based on availability (Mongoose 9: no next callback)
bookSchema.pre('save', function () {
  if (this.available === 0) {
    this.status = 'unavailable';
  } else if (this.available < 2) {
    this.status = 'low';
  } else {
    this.status = 'available';
  }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
