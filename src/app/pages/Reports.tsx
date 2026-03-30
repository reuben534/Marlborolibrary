import { useAuth } from '../context/AuthContext';
import { FileText, Download, TrendingUp, BookOpen, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function Reports() {
  const { user } = useAuth();

  const handleDownload = (reportType: string) => {
    toast.success(`Downloading ${reportType} report...`);
  };

  const stats = {
    totalBooks: 156,
    totalMembers: 89,
    activeBorrows: 34,
    overdueBooks: 8,
    booksAddedThisMonth: 12,
    newMembersThisMonth: 7,
  };

  const popularBooks = [
    { title: 'Clean Code', borrows: 45 },
    { title: 'The Pragmatic Programmer', borrows: 38 },
    { title: 'Design Patterns', borrows: 32 },
    { title: 'Refactoring', borrows: 28 },
    { title: 'Introduction to Algorithms', borrows: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Library statistics and performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded-lg p-3">
              <BookOpen className="size-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">+{stats.booksAddedThisMonth} this month</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Books</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 rounded-lg p-3">
              <Users className="size-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">+{stats.newMembersThisMonth} this month</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Members</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 rounded-lg p-3">
              <Clock className="size-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Active Borrows</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.activeBorrows}</p>
        </div>
      </div>

      {/* Most Popular Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 rounded-lg p-2.5">
            <TrendingUp className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Most Popular Books</h2>
            <p className="text-sm text-gray-600">Based on borrow frequency</p>
          </div>
        </div>

        <div className="space-y-4">
          {popularBooks.map((book, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="size-8 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{book.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-[#1B5E4B] h-2 rounded-full"
                    style={{ width: `${(book.borrows / popularBooks[0].borrows) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{book.borrows} borrows</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#1B5E4B] rounded-lg p-2.5">
            <FileText className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Download Reports</h2>
            <p className="text-sm text-gray-600">Export data in various formats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleDownload('Monthly Books')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="size-5 text-[#1B5E4B]" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Monthly Books Report</h3>
                <p className="text-xs text-gray-600">All books added this month</p>
              </div>
            </div>
            <Download className="size-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleDownload('Members')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="size-5 text-[#1B5E4B]" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Members Report</h3>
                <p className="text-xs text-gray-600">Complete member list</p>
              </div>
            </div>
            <Download className="size-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleDownload('Active Borrows')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-[#1B5E4B]" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Active Borrows</h3>
                <p className="text-xs text-gray-600">Currently borrowed books</p>
              </div>
            </div>
            <Download className="size-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleDownload('Overdue')}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-red-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Overdue Books</h3>
                <p className="text-xs text-gray-600">Books past due date</p>
              </div>
            </div>
            <Download className="size-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
