import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { toast } from 'sonner';

interface Borrow {
  _id: string;
  book: {
    title: string;
    author: string;
  };
  borrowDate: string;
  dueDate: string;
  status: 'pending' | 'active' | 'returned' | 'overdue' | 'rejected';
}

export function MemberDashboard() {
  const { user } = useAuth();
  const [myBorrows, setMyBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBorrows = async () => {
    try {
      const data = await apiClient('/transactions/my-history');
      setMyBorrows(data);
    } catch (error) {
      console.error('Error fetching borrows:', error);
      toast.error('Failed to load borrowing history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBorrows();
  }, [user]);

  const activeCount = myBorrows.filter(b => b.status === 'active' || b.status === 'overdue').length;
  const overdueCount = myBorrows.filter(b => b.status === 'overdue').length;
  const pendingCount = myBorrows.filter(b => b.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="size-8 animate-spin text-[#1B5E4B]" />
        <p className="text-gray-600">Loading your activity...</p>
      </div>
    );
  }

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
          <h3 className="text-gray-600 text-sm mb-1">Active Loans</h3>
          <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 rounded-lg p-3">
              <Clock className="size-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Pending Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
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
      </div>

      {/* My Borrowed Books */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Borrowing Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {myBorrows.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't borrowed any books yet.</p>
            </div>
          ) : (
            <>
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
                      <tr key={borrow._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center">
                              <BookOpen className="size-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {borrow.book.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{borrow.book.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {borrow.status === 'pending' ? '—' : new Date(borrow.borrowDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {borrow.status === 'pending' ? '—' : new Date(borrow.dueDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">
                          {borrow.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              <Clock className="size-3" />
                              Pending Approval
                            </span>
                          )}
                          {borrow.status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <Clock className="size-3" />
                              Active
                            </span>
                          )}
                          {borrow.status === 'overdue' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <AlertCircle className="size-3" />
                              Overdue
                            </span>
                          )}
                          {borrow.status === 'returned' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="size-3" />
                              Returned
                            </span>
                          )}
                          {borrow.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              <X className="size-3" />
                              Rejected
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
                  <div key={borrow._id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="size-12 rounded-lg bg-[#1B5E4B] text-white flex items-center justify-center flex-shrink-0">
                        <BookOpen className="size-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{borrow.book.title}</h3>
                        <p className="text-sm text-gray-600">{borrow.book.author}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Borrowed:</span>
                        <span className="text-gray-900">
                          {borrow.status === 'pending' ? '—' : new Date(borrow.borrowDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due:</span>
                        <span className="text-gray-900">
                          {borrow.status === 'pending' ? '—' : new Date(borrow.dueDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <div className="pt-2">
                        {borrow.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            <Clock className="size-3" />
                            Pending Approval
                          </span>
                        )}
                        {borrow.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <Clock className="size-3" />
                            Active
                          </span>
                        )}
                        {borrow.status === 'overdue' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <AlertCircle className="size-3" />
                            Overdue
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
            </>
          )}
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
            <span>Late returns incur a fine of R1.00 per day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Maximum of 5 books can be borrowed at once</span>
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

