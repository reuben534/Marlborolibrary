import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, BookOpen, Calendar, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface BorrowHistory {
  id: string;
  bookTitle: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  fine?: number;
}

export function BorrowHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const [history] = useState<BorrowHistory[]>([
    {
      id: '1',
      bookTitle: 'Clean Code',
      memberName: 'John Smith',
      borrowDate: '20/02/2026',
      dueDate: '06/03/2026',
      status: 'active',
    },
    {
      id: '2',
      bookTitle: 'The Pragmatic Programmer',
      memberName: 'Mary Johnson',
      borrowDate: '15/02/2026',
      dueDate: '01/03/2026',
      status: 'overdue',
      fine: 10.0,
    },
    {
      id: '3',
      bookTitle: 'Design Patterns',
      memberName: 'Peter Williams',
      borrowDate: '01/02/2026',
      dueDate: '15/02/2026',
      returnDate: '14/02/2026',
      status: 'returned',
    },
    {
      id: '4',
      bookTitle: 'Refactoring',
      memberName: 'Emma Davis',
      borrowDate: '10/02/2026',
      dueDate: '24/02/2026',
      returnDate: '22/02/2026',
      status: 'returned',
    },
    {
      id: '5',
      bookTitle: 'Introduction to Algorithms',
      memberName: 'James Wilson',
      borrowDate: '25/02/2026',
      dueDate: '11/03/2026',
      status: 'active',
    },
  ]);

  const filteredHistory = history.filter(
    (item) =>
      item.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (item: BorrowHistory) => {
    if (item.status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          <Clock className="size-3" />
          Active
        </span>
      );
    }
    if (item.status === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertCircle className="size-3" />
          Overdue
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <CheckCircle className="size-3" />
        Returned
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Borrow History</h1>
        <p className="text-gray-600 mt-1">Complete record of all book transactions</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by book or member name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Book Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Member
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Borrow Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Due Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Return Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Fine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center">
                        <BookOpen className="size-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.bookTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.memberName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.borrowDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.dueDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.returnDate || '-'}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {item.fine ? `£${item.fine.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="size-12 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center flex-shrink-0">
                <BookOpen className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{item.bookTitle}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="size-3" />
                  {item.memberName}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Borrowed:</span>
                <span className="text-gray-900">{item.borrowDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due:</span>
                <span className="text-gray-900">{item.dueDate}</span>
              </div>
              {item.returnDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Returned:</span>
                  <span className="text-gray-900">{item.returnDate}</span>
                </div>
              )}
              {item.fine && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fine:</span>
                  <span className="text-red-600 font-semibold">£{item.fine.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100">{getStatusBadge(item)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
