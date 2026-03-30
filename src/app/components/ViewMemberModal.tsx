import { X, User, Phone, Mail, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface ViewMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive';
    memberSince: string;
  } | null;
}

export function ViewMemberModal({ open, onOpenChange, member }: ViewMemberModalProps) {
  if (!open || !member) return null;

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
                  <User className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
                  <p className="text-sm text-gray-600">View member information</p>
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
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                <div className="size-20 rounded-full bg-[#1B5E4B] text-white flex items-center justify-center text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {member.status === 'active' ? 'Active Member' : 'Inactive Member'}
                  </span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Phone className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">{member.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Mail className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-900">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <Calendar className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{member.memberSince}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <MapPin className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      123 Library Street, London, SW1A 1AA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white rounded-lg p-2">
                    <AlertCircle className="size-5 text-[#1B5E4B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Emergency Contact</p>
                    <p className="text-sm font-medium text-gray-900">+44 20 7946 0958</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1B5E4B]">12</p>
                  <p className="text-xs text-gray-600 mt-1">Books Borrowed</p>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <p className="text-2xl font-bold text-[#1B5E4B]">2</p>
                  <p className="text-xs text-gray-600 mt-1">Currently Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">£0.00</p>
                  <p className="text-xs text-gray-600 mt-1">Outstanding Fines</p>
                </div>
              </div>

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
