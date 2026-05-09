import { useState, useEffect } from 'react';
import { X, Monitor, MapPin, Cpu, Loader2 } from 'lucide-react';

interface Computer {
  _id: string;
  name: string;
  location: string;
  specifications: string;
  status: 'available' | 'booked' | 'in-use' | 'maintenance';
}

interface ComputerManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  computer: Computer | null;
  onSave: (data: any) => Promise<void>;
}

export function ComputerManagementModal({
  open,
  onOpenChange,
  computer,
  onSave,
}: ComputerManagementModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [status, setStatus] = useState<Computer['status']>('available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && computer) {
      setName(computer.name);
      setLocation(computer.location);
      setSpecifications(computer.specifications);
      setStatus(computer.status);
    } else if (open) {
      setName('');
      setLocation('');
      setSpecifications('');
      setStatus('available');
    }
  }, [open, computer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        _id: computer?._id,
        name,
        location,
        specifications,
        status,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

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
                  <h2 className="text-xl font-bold text-gray-900">
                    {computer ? 'Edit Computer' : 'Add Computer'}
                  </h2>
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Monitor className="size-4" />
                  Computer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Computer 01"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="size-4" />
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="E.g., Main Floor - Section A"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Cpu className="size-4" />
                  Specifications <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="E.g., Intel i7, 16GB RAM, Windows 11"
                  required
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Computer['status'])}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B]"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
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
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    computer ? 'Save Changes' : 'Add Computer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
