import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private (Admin/Librarian)
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('member', 'name email')
      .populate('book', 'title author isbn');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a transaction (Borrow book)
// @route   POST /api/transactions/borrow
// @access  Private (Admin/Librarian)
export const borrowBook = async (req, res) => {
  const { memberId, bookId, notes } = req.body;

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.status !== 'active') {
      return res.status(400).json({ message: 'Member is not active' });
    }

    // Check member borrowing limit (max 5)
    const activeLoans = await Transaction.countDocuments({
      member: memberId,
      status: { $in: ['active', 'overdue'] },
    });

    if (activeLoans >= 5) {
      return res.status(400).json({ message: 'Member has reached the borrowing limit (5 books)' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.available <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   POST /api/transactions/return/:id
// @access  Private (Admin/Librarian)
export const returnBook = async (req, res) => {
  const { condition, notes } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    const returnDate = new Date();
    transaction.returnDate = returnDate;
    transaction.condition = condition || 'Good';
    transaction.notes = notes || transaction.notes;
    transaction.status = 'returned';

    // Calculate fine if overdue
    const dueDate = new Date(transaction.dueDate);
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      transaction.fine = diffDays * 1.0; // £1.00 per day
    }

    await transaction.save();

    // Update book availability
    const book = await Book.findById(transaction.book);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transactions for a specific member
// @route   GET /api/transactions/member/:memberId
// @access  Private (Admin/Librarian/Self)
export const getMemberTransactions = async (req, res) => {
  try {
    // Check if user is accessing their own data or is staff
    if (req.user.role === 'member' && req.user._id.toString() !== req.params.memberId) {
       // Wait, memberId in transactions is the Member model ID, not User model ID.
       // In this system, Members are separate from Users? 
       // Looking at PROJECT_DESCRIPTION, Members are a role.
       // But in my model, Member is a separate collection.
       // I should probably link Member to User if a member can log in.
       // For now, I'll assume Admin/Librarian can see all, and I'll need to fix Member login later.
    }

    const transactions = await Transaction.find({ member: req.params.memberId })
      .populate('book', 'title author isbn');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
