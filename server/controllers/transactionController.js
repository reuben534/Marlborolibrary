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

  // Calculate fine if overdue (R1.00 per day)
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

// @desc    Request a book (Member)
// @route   POST /api/transactions/request
// @access  Private (Member)
export const requestBorrow = asyncHandler(async (req, res) => {
  const { bookId, notes } = req.body;

  if (!bookId) {
    res.status(400);
    throw new Error('Please provide book ID');
  }

  // Find the member record associated with this user's email
  const member = await Member.findOne({ email: req.user.email });
  if (!member) {
    res.status(404);
    throw new Error('Member profile not found. Please contact the librarian.');
  }

  if (member.status !== 'active') {
    res.status(400);
    throw new Error('Member is not active and cannot request books');
  }

  // Check member borrowing limit (max 5)
  const activeLoans = await Transaction.countDocuments({
    member: member._id,
    status: { $in: ['active', 'overdue', 'pending'] },
  });

  if (activeLoans >= 5) {
    res.status(400);
    throw new Error('You have reached the borrowing limit (5 books including pending requests)');
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

  // Check if member already has a pending request for this book
  const alreadyRequested = await Transaction.findOne({
    member: member._id,
    book: bookId,
    status: 'pending'
  });

  if (alreadyRequested) {
    res.status(400);
    throw new Error('You already have a pending request for this book');
  }

  // Calculate due date (14 days from now) - although it will be set on approval too
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = await Transaction.create({
    member: member._id,
    book: bookId,
    dueDate,
    notes,
    status: 'pending'
  });

  res.status(201).json(transaction);
});

// @desc    Approve a borrow request
// @route   POST /api/transactions/approve/:id
// @access  Private (Admin/Librarian)
export const approveBorrow = asyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction record not found');
  }

  if (transaction.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot approve a transaction with status: ${transaction.status}`);
  }

  const bookId = transaction.book;
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

  // Update transaction
  await Transaction.updateOne(
    { _id: transactionId },
    {
      $set: {
        status: 'active',
        borrowDate: new Date(),
        dueDate: dueDate
      }
    }
  );

  // Update book availability and status (using .save() to trigger middleware)
  book.available -= 1;
  await book.save();

  res.json({ message: 'Transaction approved successfully' });
});

// @desc    Reject a borrow request
// @route   POST /api/transactions/reject/:id
// @access  Private (Admin/Librarian)
export const rejectBorrow = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction record not found');
  }

  if (transaction.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot reject a transaction with status: ${transaction.status}`);
  }

  transaction.status = 'rejected';
  transaction.notes = notes || transaction.notes;

  await transaction.save();

  res.json(transaction);
});

// @desc    Get all pending transactions
// @route   GET /api/transactions/pending
// @access  Private (Admin/Librarian)
export const getPendingTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ status: 'pending' })
    .populate('member', 'name email')
    .populate('book', 'title author isbn');
  res.json(transactions);
});

// @desc    Get transactions for the logged-in member
// @route   GET /api/transactions/my-history
// @access  Private (Member)
export const getMyTransactions = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ email: req.user.email });
  
  if (!member) {
    res.status(404);
    throw new Error('Member profile not found');
  }

  const transactions = await Transaction.find({ member: member._id })
    .populate('book', 'title author isbn')
    .sort({ createdAt: -1 });
    
  res.json(transactions);
});

// @desc    Get transactions for a specific member
// @route   GET /api/transactions/member/:memberId
// @access  Private (Admin/Librarian/Self)
export const getMemberTransactions = asyncHandler(async (req, res) => {
  // Authorization check
  if (req.user.role === 'member') {
    // If member, ensure they are querying their own records
    const member = await Member.findOne({ email: req.user.email });
    if (!member || member._id.toString() !== req.params.memberId) {
      res.status(403);
      throw new Error('Not authorized to view these transactions');
    }
  }

  const transactions = await Transaction.find({ member: req.params.memberId })
    .populate('book', 'title author isbn')
    .sort({ createdAt: -1 });
  res.json(transactions);
});

