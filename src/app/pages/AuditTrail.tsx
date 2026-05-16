import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, LogIn, Download, FileText, Calendar, User, Clock } from 'lucide-react';
import { apiClient } from '../api/client';
import { toast } from 'sonner';

interface AuditLog {
  _id: string;
  userFullName: string;
  userRole: string;
  action: string;
  reportType?: string;
  description: string;
  createdAt: string;
}

export function AuditTrail() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      return;
    }

    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: (page * limit).toString(),
        });

        if (filterAction) {
          params.append('action', filterAction);
        }

        const data = await apiClient(`/audit/logs?${params}`);
        setLogs(data.logs);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [user, page, filterAction]);

  const filteredLogs = logs.filter(
    (log) =>
      log.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      LOGIN: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <LogIn className="size-3" />,
      },
      REPORT_ACCESS: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: <FileText className="size-3" />,
      },
      REPORT_DOWNLOAD: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        icon: <Download className="size-3" />,
      },
    };

    const badge = badges[action] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      icon: <Clock className="size-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {action.replace('_', ' ')}
      </span>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 text-lg font-medium">Access Denied</p>
        <p className="text-gray-400 text-sm">Only administrators can view audit logs</p>
      </div>
    );
  }

  if (loading && logs.length === 0) {
    return <div className="flex items-center justify-center h-64">Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-600 mt-1">System activity log - Login history & report access</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="REPORT_ACCESS">Report Access</option>
            <option value="REPORT_DOWNLOAD">Report Download</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Report Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{log.userFullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.reportType || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{log.userFullName}</h3>
                <p className="text-xs text-gray-600 capitalize">{log.userRole}</p>
              </div>
              {getActionBadge(log.action)}
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="text-gray-900">
                  {new Date(log.createdAt).toLocaleDateString('en-GB')} {new Date(log.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {log.reportType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Report:</span>
                  <span className="text-gray-900 font-medium">{log.reportType}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 border-t border-gray-100 pt-3">
              {log.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page + 1}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={filteredLogs.length < limit}
          className="px-4 py-2 bg-[#1B5E4B] text-white rounded-lg hover:bg-[#15523f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No audit logs found</p>
        </div>
      )}
    </div>
  );
}
