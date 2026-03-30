import { X, Monitor, User, Calendar, Clock, FileText } from 'lucide-react';

interface Booking {
  id: string;
  computerId: string;
  computerName: string;
  memberId: string;
  memberName: string;
  date: string;
  timeSlot: string;
  duration: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  purpose?: string;
}

interface ViewBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

export function ViewBookingModal({ open, onOpenChange, booking }: ViewBookingModalProps) {
  if (!open || !booking) return null;

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
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
                  <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                  <p className="text-sm text-gray-600">View computer booking information</p>
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
              {/* Booking Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Booking #{booking.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created for computer reservation
                  </p>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>

              {/* Information Grid */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Monitor className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Computer</p>
                    <p className="text-sm font-medium text-gray-900">{booking.computerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <User className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Member</p>
                    <p className="text-sm font-medium text-gray-900">{booking.memberName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-white rounded-lg p-2">
                      <Calendar className="size-5 text-[#1B5E4B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-white rounded-lg p-2">
                      <Clock className="size-5 text-[#1B5E4B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Time Slot</p>
                      <p className="text-sm font-medium text-gray-900">{booking.timeSlot}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Clock className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
                    </p>
                  </div>
                </div>

                {booking.purpose && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-white rounded-lg p-2">
                      <FileText className="size-5 text-[#1B5E4B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Purpose</p>
                      <p className="text-sm font-medium text-gray-900">{booking.purpose}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              {booking.status === 'upcoming' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Reminder:</strong> Please arrive 5 minutes before your scheduled time.
                    The computer will be held for 15 minutes after the start time.
                  </p>
                </div>
              )}

              {booking.status === 'active' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>✓ Active Session:</strong> Your computer session is currently active.
                    Please remember to log out when finished.
                  </p>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-6 mt-6 border-t border-gray-200">
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
      </div>
    </>
  );
}
