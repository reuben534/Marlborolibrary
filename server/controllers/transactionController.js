import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private (Admin/Librarian)
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate('member', 'name email')
    .populate('book', 'title author isbn');
  res.json(transactions);
});

// @desc    Create a transaction (Borrow book)
// @route   POST /api/transactions/borrow
// @access  Private (Admin/Librarian)
export const borrowBook = asyncHandler(async (req, res) => {
  const { memberId, bookId, notes } = req.body;

  if (!memberId || !bookId) {
    res.status(400);
    throw new Error('Please provide member ID and book ID');
  }

  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  if (member.status !== 'active') {
    res.status(400);
    throw new Error('Member is not active and cannot borrow books');
  }

  // Check member borrowing limit (max 5)
  const activeLoans = await Transaction.countDocuments({
    member: memberId,
    status: { $in: ['active', 'overdue'] },
  });

  if (activeLoans >= 5) {
    res.status(400);
    throw new Error('Member has reached the borrowing limit (5 books)');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (book.available <= 0) {
    res.status(400);
    throw new Error('Book is currently out of stock');
  }

  // Calculate due date (14 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = await Transaction.create({
    member: memberId,
    book: bookId,
    dueDate,
    notes,
  });

  // Update book availability
  book.available -= 1;
  await book.save();

  res.status(201).json(transaction);
});

// @desc    Return a book
// @route   POST /api/transactions/return/:id
// @access  Private (Admin/Librarian)
export const returnBook = asyncHandler(async (req, res) => {
  const { condition, notes } = req.body;

  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction record not found');
  }

  if (transaction.status === 'returned') {
    res.status(400);
    throw new Error('This book has already been marked as returned');
  }

  const returnDate = new Date();
  transaction.returnDate = returnDate;
  transaction.condition = condition || 'Good';
  transaction.notes = notes || transaction.notes;
  transaction.status = 'returned';

  // Calculate fine if overdue (£1.00 per day)
  const dueDate = new Date(transaction.dueDate);
  if (returnDate > dueDate) {
    const diffTime = Math.abs(returnDate - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    transaction.fine = diffDays * 1.0;
  } else {
    transaction.fine = 0;
  }

  await transaction.save();

  // Update book availability
  const book = await Book.findById(transaction.book);
  if (book) {
    book.available += 1;
    await book.save();
  }

  res.json(transaction);
});

// @desc    Get transactions for a specific member
// @route   GET /api/transactions/member/:memberId
// @access  Private (Admin/Librarian/Self)
export const getMemberTransactions = asyncHandler(async (req, res) => {
  // Authorization check
  if (req.user.role === 'member' && req.user._id.toString() !== req.params.memberId) {
    res.status(403);
    throw new Error('Not authorized to view these transactions');
  }

  const transactions = await Transaction.find({ member: req.params.memberId })
    .populate('book', 'title author isbn');
  res.json(transactions);
});
