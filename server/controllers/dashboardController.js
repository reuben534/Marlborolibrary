import Member from '../models/Member.js';
import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin/Librarian)
export const getStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({});
    const totalBooks = await Book.countDocuments({});
    
    // Borrowed today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const borrowedToday = await Transaction.countDocuments({
      borrowDate: { $gte: startOfToday },
    });

    // Overdue books
    const overdueBooks = await Transaction.countDocuments({
      status: 'overdue',
    });

    // Recent activities (last 5 transactions)
    const recentActivities = await Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('member', 'name')
      .populate('book', 'title');

    const formattedActivities = recentActivities.map(activity => ({
      id: activity._id,
      member: activity.member ? activity.member.name : 'Unknown',
      book: activity.book ? activity.book.title : 'Unknown',
      action: activity.status === 'returned' ? 'Returned' : 'Borrowed',
      date: activity.createdAt,
    }));

    res.json({
      stats: {
        totalMembers,
        totalBooks,
        borrowedToday,
        overdueBooks,
      },
      recentActivities: formattedActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
