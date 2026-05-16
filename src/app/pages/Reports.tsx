import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, TrendingUp, BookOpen, Users, Clock, Loader2, Activity } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { apiClient } from '../api/client';

export function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const result = await apiClient('/reports/stats');
        setData(result);

        // Fetch audit logs if admin
        if (user?.role === 'admin') {
          try {
            const logs = await apiClient('/audit/login-history');
            setAuditLogs(logs);
          } catch (err) {
            console.error('Error fetching audit logs:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching report stats:', error);
        toast.error('Failed to load report statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchReportStats();
  }, [user]);

  const handleDownload = async (reportType: string) => {
    try {
      toast.info(`Preparing ${reportType} report...`);
      
      const token = localStorage.getItem('token');
      // Using direct fetch because apiClient is hardcoded to parse JSON
      const response = await fetch(`http://localhost:5000/api/reports/export/${encodeURIComponent(reportType)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType.toLowerCase().replace(' ', '_')}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${reportType} report downloaded successfully!`);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-[#1B5E4B]" />
      </div>
    );
  }

  if (!data) return null;

  const {
    totalBooks,
    totalMembers,
    activeBorrows,
    overdueBooks,
    booksAddedThisMonth,
    newMembersThisMonth,
    popularBooks
  } = data;

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
            <span className="text-xs text-green-600 font-medium">+{booksAddedThisMonth} this month</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Books</h3>
          <p className="text-3xl font-bold text-gray-900">{totalBooks}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 rounded-lg p-3">
              <Users className="size-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">+{newMembersThisMonth} this month</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Members</h3>
          <p className="text-3xl font-bold text-gray-900">{totalMembers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 rounded-lg p-3">
              <Clock className="size-6 text-white" />
            </div>
            {overdueBooks > 0 && (
              <span className="text-xs text-red-600 font-medium">{overdueBooks} overdue</span>
            )}
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Active Borrows</h3>
          <p className="text-3xl font-bold text-gray-900">{activeBorrows}</p>
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
          {popularBooks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No borrowing activity yet.</p>
          ) : (
            popularBooks.map((book: any, index: number) => (
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
            ))
          )}
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
            <p className="text-sm text-gray-600">Export data in professional PDF format</p>
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

      {/* Audit Trail Preview (Admin Only) */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500 rounded-lg p-2.5">
              <Activity className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity Log</h2>
              <p className="text-sm text-gray-600">Recent login & report access history</p>
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No activity logged yet.</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {auditLogs.slice(0, 5).map((log: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log.userFullName} ({log.userRole})
                      </p>
                      <p className="text-xs text-gray-600">
                        {log.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-900 font-semibold">
                        {new Date(log.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(log.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/audit-trail"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B5E4B] text-white rounded-lg hover:bg-[#15523f] transition-colors text-sm font-medium"
              >
                <Activity className="size-4" />
                View Full Audit Trail
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
