import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, BookUp, AlertTriangle, Plus, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: '1,234',
      change: '+12%',
      color: 'bg-blue-500',
    },
    {
      icon: BookOpen,
      label: 'Total Books',
      value: '5,678',
      change: '+8%',
      color: 'bg-green-500',
    },
    {
      icon: BookUp,
      label: 'Borrowed Today',
      value: '89',
      change: '+23%',
      color: 'bg-purple-500',
    },
    {
      icon: AlertTriangle,
      label: 'Overdue Books',
      value: '12',
      change: '-5%',
      color: 'bg-red-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      member: 'John Smith',
      book: 'Clean Code',
      action: 'Borrowed',
      date: '06/03/2026 14:30',
    },
    {
      id: 2,
      member: 'Mary Johnson',
      book: 'The Pragmatic Programmer',
      action: 'Returned',
      date: '06/03/2026 13:15',
    },
    {
      id: 3,
      member: 'Peter Williams',
      book: 'Design Patterns',
      action: 'Borrowed',
      date: '06/03/2026 11:45',
    },
    {
      id: 4,
      member: 'Emma Brown',
      book: 'Refactoring',
      action: 'Returned',
      date: '06/03/2026 10:20',
    },
  ];

  const quickActions = [
    { label: 'Add Member', icon: Users, color: 'bg-blue-500' },
    { label: 'Borrow Book', icon: BookUp, color: 'bg-green-500' },
    { label: 'Return Book', icon: BookOpen, color: 'bg-purple-500' },
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

      {/* Recent Activity */}
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
                  <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                  <th className="text-left px-4 md:px-6 py-3 text-sm font-semibold text-gray-700">
                    Date/Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
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
                      {activity.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}