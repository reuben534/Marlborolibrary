import { useState, useEffect } from 'react';
import { X, Monitor, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Computer {
  id: string;
  name: string;
  location: string;
  specifications: string;
  status: string;
}

interface BookComputerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  computer: Computer | null;
  onSave: (data: any) => void;
}

export function BookComputerModal({ open, onOpenChange, computer, onSave }: BookComputerModalProps) {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    if (open) {
      // Set minimum date to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setTimeSlot('');
      setDuration(1);
      setPurpose('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      computerId: computer?.id,
      computerName: computer?.name,
      date,
      timeSlot,
      duration,
      purpose,
    });

    onOpenChange(false);
  };

  if (!open || !computer) return null;

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in transform -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-[#1B5E4B] rounded-lg p-2.5">
                  <Monitor className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Book Computer</h2>
                  <p className="text-sm text-gray-600">Reserve a computer for study</p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {/* Computer Info */}
            <div className="px-6 pt-4 pb-2 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="bg-[#1B5E4B]/10 rounded-lg p-2">
                  <Monitor className="size-5 text-[#1B5E4B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{computer.name}</h3>
                  <p className="text-sm text-gray-600">{computer.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{computer.specifications}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Member Name (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="size-4" />
                  Member Name
                </label>
                <input
                  type="text"
                  value={user?.fullName || ''}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="size-4" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="size-4" />
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="size-4" />
                  Duration (hours) <span className="text-red-500">*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Purpose (Optional)
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  placeholder="E.g., Research work, document editing, online learning..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors"
                >
                  Book Computer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
