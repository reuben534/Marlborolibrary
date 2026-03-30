import { useState, useEffect } from 'react';
import { X, Upload, User, Save } from 'lucide-react';
import { toast } from 'sonner';

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  } | null;
  onSave: (data: any) => void;
}

export function MemberModal({ open, onOpenChange, member, onSave }: MemberModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.name,
        idNumber: '',
        phone: member.phone,
        email: member.email,
        address: '',
        emergencyContact: '',
      });
    } else {
      setFormData({
        fullName: '',
        idNumber: '',
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',
      });
    }
  }, [member, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(member ? 'Member updated successfully!' : 'Member added successfully!');
    onOpenChange(false);
  };

  if (!open) return null;

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
                <div className="bg-[#1B5E4B] rounded-lg p-2.5">
                  <User className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {member ? 'Edit Member' : 'Add New Member'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {member ? 'Update member information' : 'Fill in member details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                <div className="size-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User className="size-10 text-gray-400" />
                </div>
                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                  <Upload className="size-4 inline-block mr-2" />
                  Upload Photo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                    placeholder="Enter ID number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                    placeholder="+44 20 7946 0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Enter full address"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                    placeholder="+44 20 7946 0000"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors"
                >
                  <Save className="size-5" />
                  {member ? 'Save Changes' : 'Add Member'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
