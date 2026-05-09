import { useState, useEffect } from 'react';
import { X, Monitor, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { apiClient } from '../api/client';

interface Computer {
  _id: string;
  name: string;
  location: string;
  specifications: string;
  status: string;
}

interface BookComputerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  computer: Computer | null;
  onSave: (data: any) => Promise<void>;
}

export function BookComputerModal({ open, onOpenChange, computer, onSave }: BookComputerModalProps) {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<{ _id: string, name: string }[]>([]);
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setTimeSlot('');
      setDuration(1);
      setPurpose('');
      setSelectedMember(user?.role === 'member' ? user._id : '');
      
      if (user?.role !== 'member') {
        const fetchMembers = async () => {
          try {
            const data = await apiClient('/members');
            setMembers(data);
          } catch (error) {
            console.error('Failed to fetch members');
          }
        };
        fetchMembers();
      }
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!computer || !selectedMember) {
      toast.error('Missing required information');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        computerId: computer._id,
        memberId: selectedMember,
        date,
        timeSlot,
        duration,
        purpose,
      });
      onOpenChange(false);
    } catch (error: any) {
      // Error handled by parent toast
    } finally {
      setIsSubmitting(false);
    }
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
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => !isSubmitting && onOpenChange(false)}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
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
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 pt-4 pb-2 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="bg-[#1B5E4B]/10 rounded-lg p-2">
                  <Monitor className="size-5 text-[#1B5E4B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{computer.name}</h3>
                  <p className="text-sm text-gray-600">{computer.location}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="size-4" />
                  Select Member <span className="text-red-500">*</span>
                </label>
                {user?.role === 'member' ? (
                   <input
                    type="text"
                    value={user.fullName}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]"
                  >
                    <option value="">Choose a member</option>
                    {members.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                )}
              </div>

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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="size-4" />
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Booking...' : 'Book Computer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
