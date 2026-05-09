import Computer from '../models/Computer.js';
import ComputerBooking from '../models/ComputerBooking.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// --- Computer Management ---

// @desc    Get all computers
// @route   GET /api/computers
export const getComputers = asyncHandler(async (req, res) => {
  const computers = await Computer.find({});
  res.json(computers);
});

// @desc    Create a computer
// @route   POST /api/computers
export const createComputer = asyncHandler(async (req, res) => {
  const { name, location, specifications, status } = req.body;

  if (!name || !location || !specifications) {
    res.status(400);
    throw new Error('Please provide name, location, and specifications');
  }

  const computer = await Computer.create({
    name,
    location,
    specifications,
    status: status || 'available',
  });

  res.status(201).json(computer);
});

// @desc    Update a computer
// @route   PUT /api/computers/:id
export const updateComputer = asyncHandler(async (req, res) => {
  const { name, location, specifications, status } = req.body;

  const computer = await Computer.findById(req.params.id);

  if (computer) {
    computer.name = name || computer.name;
    computer.location = location || computer.location;
    computer.specifications = specifications || computer.specifications;
    computer.status = status || computer.status;

    const updatedComputer = await computer.save();
    res.json(updatedComputer);
  } else {
    res.status(404);
    throw new Error('Computer not found');
  }
});

// @desc    Delete a computer
// @route   DELETE /api/computers/:id
export const deleteComputer = asyncHandler(async (req, res) => {
  const computer = await Computer.findById(req.params.id);

  if (computer) {
    // Check for active bookings
    const activeBookings = await ComputerBooking.countDocuments({
      computer: req.params.id,
      status: { $in: ['upcoming', 'active'] },
    });

    if (activeBookings > 0) {
      res.status(400);
      throw new Error('Cannot delete computer with active or upcoming bookings');
    }

    await computer.deleteOne();
    res.json({ message: 'Computer removed' });
  } else {
    res.status(404);
    throw new Error('Computer not found');
  }
});

// --- Booking Management ---

// @desc    Get all bookings
// @route   GET /api/computers/bookings
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await ComputerBooking.find({})
    .populate('computer', 'name location')
    .populate('member', 'name email');
  res.json(bookings);
});

// @desc    Create a booking
// @route   POST /api/computers/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { computerId, memberId, date, timeSlot, duration, purpose } = req.body;

  if (!computerId || !memberId || !date || !timeSlot) {
    res.status(400);
    throw new Error('Please provide computer, member, date, and time slot');
  }

  // Check if computer is available
  const computer = await Computer.findById(computerId);
  if (!computer) {
    res.status(404);
    throw new Error('Computer not found');
  }

  if (computer.status === 'maintenance') {
    res.status(400);
    throw new Error('Computer is currently under maintenance');
  }

  // Check for existing booking at the same time (simplified)
  const existingBooking = await ComputerBooking.findOne({
    computer: computerId,
    date,
    timeSlot,
    status: { $in: ['upcoming', 'active'] },
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('Computer is already booked for this time slot');
  }

  const booking = await ComputerBooking.create({
    computer: computerId,
    member: memberId,
    date,
    timeSlot,
    duration: duration || 1,
    purpose,
  });

  // Update computer status if booking is for today (optional logic)
  // For now, let's just create the booking

  res.status(201).json(booking);
});

// @desc    Cancel a booking
// @route   DELETE /api/computers/bookings/:id
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await ComputerBooking.findById(req.params.id);

  if (booking) {
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});
