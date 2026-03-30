import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function MemberDashboard() {
  const { user } = useAuth();

  const myBorrows = [
    {
      id: 1,
      book: 'Clean Code',
      author: 'Robert C. Martin',
      borrowDate: '20/02/2026',
      dueDate: '06/03/2026',
      status: 'active',
      daysLeft: 0,
    },
    {
      id: 2,
      book: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      borrowDate: '15/02/2026',
      dueDate: '01/03/2026',
      status: 'overdue',
      daysOverdue: 5,
    },
    {
      id: 3,
      book: 'Refactoring',
      author: 'Martin Fowler',
      borrowDate: '10/02/2026',
      dueDate: '24/02/2026',
      status: 'returned',
      returnDate: '23/02/2026',
    },
  ];

  const activeCount = myBorrows.filter(b => b.status === 'active').length;
  const overdueCount = myBorrows.filter(b => b.status === 'overdue').length;
  const returnedCount = myBorrows.filter(b => b.status === 'returned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Your library activity - {new Date().toLocaleDateString('en-GB')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 rounded-lg p-3">
              <BookOpen className="size-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Currently Borrowed</h3>
          <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 rounded-lg p-3">
              <AlertCircle className="size-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Overdue Books</h3>
          <p className="text-3xl font-bold text-gray-900">{overdueCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 rounded-lg p-3">
              <CheckCircle className="size-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Books Returned</h3>
          <p className="text-3xl font-bold text-gray-900">{returnedCount}</p>
        </div>
      </div>

      {/* My Borrowed Books */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Borrowed Books</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Book Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Author
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Borrow Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myBorrows.map((borrow) => (
                  <tr key={borrow.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center">
                          <BookOpen className="size-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {borrow.book}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{borrow.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{borrow.borrowDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{borrow.dueDate}</td>
                    <td className="px-6 py-4">
                      {borrow.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <Clock className="size-3" />
                          Due today
                        </span>
                      )}
                      {borrow.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertCircle className="size-3" />
                          {borrow.daysOverdue} days overdue
                        </span>
                      )}
                      {borrow.status === 'returned' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="size-3" />
                          Returned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {myBorrows.map((borrow) => (
              <div key={borrow.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="size-12 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center flex-shrink-0">
                    <BookOpen className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{borrow.book}</h3>
                    <p className="text-sm text-gray-600">{borrow.author}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Borrowed:</span>
                    <span className="text-gray-900">{borrow.borrowDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due:</span>
                    <span className="text-gray-900">{borrow.dueDate}</span>
                  </div>
                  <div className="pt-2">
                    {borrow.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <Clock className="size-3" />
                        Due today
                      </span>
                    )}
                    {borrow.status === 'overdue' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <AlertCircle className="size-3" />
                        {borrow.daysOverdue} days overdue
                      </span>
                    )}
                    {borrow.status === 'returned' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="size-3" />
                        Returned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Library Rules */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Library Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Books can be borrowed for a maximum of 14 days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Late returns incur a fine of £2.00 per day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Maximum of 3 books can be borrowed at once</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Please handle all books with care and return them in good condition</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
