import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, BookUp, AlertTriangle, Plus, TrendingUp, Check, X, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { toast } from 'sonner';

interface Stats {
  totalMembers: number;
  totalBooks: number;
  borrowedToday: number;
  overdueBooks: number;
}

interface Activity {
  id: string;
  member: string;
  book: string;
  action: string;
  date: string;
}

interface PendingRequest {
  _id: string;
  member: {
    _id: string;
    name: string;
  };
  book: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<{ stats: Stats; recentActivities: Activity[] } | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const result = await apiClient('/dashboard/stats');
      setData(result);
      
      const requests = await apiClient('/transactions/pending');
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'member') {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      await apiClient(`/transactions/approve/${id}`, { method: 'POST' });
      toast.success('Borrow request approved!');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient(`/transactions/reject/${id}`, { method: 'POST' });
      toast.success('Borrow request rejected');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="size-8 animate-spin text-[#1B5E4B]" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: data?.stats.totalMembers.toLocaleString() || '0',
      change: '+0%',
      color: 'bg-blue-500',
    },
    {
      icon: BookOpen,
      label: 'Total Books',
      value: data?.stats.totalBooks.toLocaleString() || '0',
      change: '+0%',
      color: 'bg-green-500',
    },
    {
      icon: BookUp,
      label: 'Borrowed Today',
      value: data?.stats.borrowedToday.toString() || '0',
      change: '+0%',
      color: 'bg-purple-500',
    },
    {
      icon: AlertTriangle,
      label: 'Overdue Books',
      value: data?.stats.overdueBooks.toString() || '0',
      change: '+0%',
      color: 'bg-red-500',
    },
  ];

  const quickActions = [
    { label: 'Add Member', icon: Users, color: 'bg-blue-500', path: '/members' },
    { label: 'Borrow Book', icon: BookUp, color: 'bg-green-500', path: '/borrow' },
    { label: 'Return Book', icon: BookOpen, color: 'bg-purple-500', path: '/return' },
  ];

  // Filter quick actions based on role
  const filteredQuickActions =
    user?.role === 'member'
      ? []
      : quickActions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome, {user?.fullName}!
        </h1>
        <p className="text-gray-600 mt-1">
          System overview - {new Date().toLocaleDateString('en-GB')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="size-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="size-4" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {filteredQuickActions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredQuickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow text-left group"
                >
                  <div className={`${action.color} rounded-lg p-3 inline-flex mb-3`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#1B5E4B] transition-colors">
                    {action.label}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Plus className="size-4" />
                    <span>Click to start</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {user?.role !== 'member' && pendingRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Borrow Requests</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Member
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Book Requested
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Request Date
                    </th>
                    <th className="text-right px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-900 font-medium">
                        {request.member.name}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                        {request.book.title}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Request"
                          >
                            <Check className="size-5" />
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Request"
                          >
                            <X className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {data?.recentActivities && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Member
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Book
                    </th>
                    <th className="text-left px-6 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                      Date/Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.recentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-900 font-medium">
                        {activity.member}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600">
                        {activity.book}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            activity.action === 'Borrowed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-500">
                        {new Date(activity.date).toLocaleString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
