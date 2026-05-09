import express from 'express';
import {
  getComputers,
  createComputer,
  updateComputer,
  deleteComputer,
  getBookings,
  createBooking,
  cancelBooking,
} from '../controllers/computerController.js';
import { protect, librarian } from '../middleware/authMiddleware.js';

const router = express.Router();

// Computer Routes
router.route('/').get(protect, getComputers).post(protect, librarian, createComputer);
router.route('/:id').put(protect, librarian, updateComputer).delete(protect, librarian, deleteComputer);

// Booking Routes
router.route('/bookings').get(protect, getBookings).post(protect, createBooking);
router.route('/bookings/:id').delete(protect, cancelBooking);

export default router;
