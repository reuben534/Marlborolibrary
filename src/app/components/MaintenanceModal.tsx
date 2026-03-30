import { useState, useEffect } from 'react';
import { X, AlertTriangle, Calendar, User, FileText, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Computer {
  id: string;
  name: string;
  location: string;
  specifications: string;
  status: string;
}

interface MaintenanceRecord {
  id: string;
  date: string;
  reportedBy: string;
  issue: string;
  notes: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface MaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  computer: Computer | null;
  onEnd: (computer: Computer) => void;
}

export function MaintenanceModal({ open, onOpenChange, computer, onEnd }: MaintenanceModalProps) {
  const { user } = useAuth();
  const [issue, setIssue] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Mock maintenance history
  const [maintenanceHistory] = useState<MaintenanceRecord[]>([
    {
      id: '1',
      date: '2026-03-20',
      reportedBy: 'John Admin',
      issue: 'Keyboard malfunction',
      notes: 'Keys not responding properly. Replaced keyboard.',
      status: 'completed',
    },
    {
      id: '2',
      date: '2026-02-15',
      reportedBy: 'Sarah Librarian',
      issue: 'Monitor display issues',
      notes: 'Screen flickering. Replaced display cable.',
      status: 'completed',
    },
  ]);

  useEffect(() => {
    if (open) {
      setIssue('');
      setNotes('');
      setPriority('medium');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In real app, this would save maintenance record
    console.log('Maintenance record:', { issue, notes, priority });
    
    onOpenChange(false);
  };

  if (!open || !computer) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-scale-in transform -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-lg p-2.5">
                  <AlertTriangle className="size-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Maintenance & Repair</h2>
                  <p className="text-sm text-gray-600">{computer.name} - {computer.location}</p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Report New Issue */}
              <form onSubmit={handleSubmit} className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Report New Issue</h3>
                
                <div className="space-y-4">
                  {/* Issue Description */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Wrench className="size-4" />
                      Issue Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      placeholder="E.g., Keyboard not working, screen flickering..."
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="low">Low - Non-urgent repair</option>
                      <option value="medium">Medium - Normal repair needed</option>
                      <option value="high">High - Urgent repair required</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText className="size-4" />
                      Detailed Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Provide detailed information about the issue..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Reported By */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="size-4" />
                      Reported By
                    </label>
                    <input
                      type="text"
                      value={user?.fullName || ''}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Submit Maintenance Report
                  </button>
                </div>
              </form>

              {/* Maintenance History */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Maintenance History</h3>
                
                {maintenanceHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="size-12 mx-auto mb-2 text-gray-400" />
                    <p>No maintenance history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {maintenanceHistory.map((record) => (
                      <div
                        key={record.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.issue}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Calendar className="size-3" />
                                {record.date}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <User className="size-3" />
                                {record.reportedBy}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {computer.status === 'maintenance' && (
                <button
                  type="button"
                  onClick={() => onEnd(computer)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  End Maintenance
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
