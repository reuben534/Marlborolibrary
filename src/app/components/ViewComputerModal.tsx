import { X, Monitor, MapPin, Cpu, Calendar, Activity, CheckCircle2, XCircle } from 'lucide-react';

interface Computer {
  id: string;
  name: string;
  location: string;
  specifications: string;
  status: 'available' | 'booked' | 'in-use' | 'maintenance';
}

interface ViewComputerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  computer: Computer | null;
}

export function ViewComputerModal({ open, onOpenChange, computer }: ViewComputerModalProps) {
  if (!open || !computer) return null;

  const getStatusColor = (status: Computer['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'booked':
        return 'bg-blue-100 text-blue-700';
      case 'in-use':
        return 'bg-yellow-100 text-yellow-700';
      case 'maintenance':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Computer['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'in-use':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  // Mock statistics
  const stats = {
    totalBookings: 45,
    totalHours: 127,
    avgDuration: 2.8,
    lastMaintenance: '2026-03-20',
    uptime: 98.5,
  };

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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-scale-in transform -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-[#1B5E4B] rounded-lg p-2.5">
                  <Monitor className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Computer Details</h2>
                  <p className="text-sm text-gray-600">Complete information and statistics</p>
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
            <div className="p-6">
              {/* Computer Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{computer.name}</h3>
                  <p className="text-sm text-gray-600">Computer ID: #{computer.id}</p>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(computer.status)}`}
                >
                  {getStatusText(computer.status)}
                </span>
              </div>

              {/* Basic Information */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <MapPin className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-900">{computer.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Cpu className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Specifications</p>
                    <p className="text-sm font-medium text-gray-900">{computer.specifications}</p>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-600 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Total Hours Used</p>
                    <p className="text-2xl font-bold text-green-900">{stats.totalHours}h</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 mb-1">Avg. Duration</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.avgDuration}h</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-600 mb-1">Uptime</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.uptime}%</p>
                  </div>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Maintenance Information</h4>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Calendar className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Last Maintenance</p>
                    <p className="text-sm font-medium text-gray-900">{stats.lastMaintenance}</p>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="size-5 text-[#1B5E4B]" />
                  Current Status Details
                </h4>
                {computer.status === 'available' && (
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Available for Booking</p>
                      <p className="text-gray-600">This computer is ready to be booked by members.</p>
                    </div>
                  </div>
                )}
                {computer.status === 'booked' && (
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Calendar className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Currently Booked</p>
                      <p className="text-gray-600">This computer has an active booking reservation.</p>
                    </div>
                  </div>
                )}
                {computer.status === 'in-use' && (
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Activity className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Currently In Use</p>
                      <p className="text-gray-600">A member is actively using this computer.</p>
                    </div>
                  </div>
                )}
                {computer.status === 'maintenance' && (
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Under Maintenance</p>
                      <p className="text-gray-600">This computer is currently being serviced and is unavailable for booking.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => onOpenChange(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
