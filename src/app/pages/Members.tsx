import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { MemberModal } from '../components/MemberModal';
import { ViewMemberModal } from '../components/ViewMemberModal';
import { toast } from 'sonner';
import { apiClient } from '../api/client';

interface Member {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  memberSince: string;
}

export function Members() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  });
  const [memberModal, setMemberModal] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  });
  const [viewMemberModal, setViewMemberModal] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  });

  const fetchMembers = async () => {
    try {
      const data = await apiClient('/members');
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal.member) return;
    
    try {
      await apiClient(`/members/${deleteModal.member._id}`, {
        method: 'DELETE',
      });
      toast.success(`Member ${deleteModal.member.name} removed successfully!`);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleSaveMember = async (data: any) => {
    try {
      if (memberModal.member) {
        // Update
        await apiClient(`/members/${memberModal.member._id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Member updated successfully!');
      } else {
        // Create
        await apiClient('/members', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Member added successfully!');
      }
      fetchMembers();
      setMemberModal({ open: false, member: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save member');
    }
  };

  // Check permissions
  const canManage = user?.role === 'admin' || user?.role === 'librarian';

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Manage Members
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredMembers.length} members registered
          </p>
        </div>
        {canManage && (
          <button 
            onClick={() => setMemberModal({ open: true, member: null })}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors">
            <Plus className="size-5" />
            Add Member
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Members Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Member Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Member Since
                </th>
                {canManage && (
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[#1B5E4B] text-white flex items-center justify-center font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(member.memberSince).toLocaleDateString('en-GB')}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMemberModal({ open: true, member })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button 
                          onClick={() => setMemberModal({ open: true, member })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, member })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Members Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="size-12 rounded-full bg-[#1B5E4B] text-white flex items-center justify-center font-semibold text-lg">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {member.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="size-4" />
                {member.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="size-4" />
                {member.email}
              </div>
              <div className="text-sm text-gray-500">
                Member since: {new Date(member.memberSince).toLocaleDateString('en-GB')}
              </div>
            </div>

            {canManage && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setViewMemberModal({ open: true, member })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  <Eye className="size-4" />
                  View
                </button>
                <button 
                  onClick={() => setMemberModal({ open: true, member })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg font-medium hover:bg-green-100 transition-colors">
                  <Edit className="size-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, member })}
                  className="flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, member: null })}
        title="Remove Member"
        description={`Are you sure you want to remove the member "${deleteModal.member?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="danger"
      />

      {/* Member Add/Edit Modal */}
      <MemberModal
        open={memberModal.open}
        onOpenChange={(open) => setMemberModal({ open, member: null })}
        member={memberModal.member}
        onSave={handleSaveMember}
      />

      {/* Member View Modal */}
      <ViewMemberModal
        open={viewMemberModal.open}
        onOpenChange={(open) => setViewMemberModal({ open, member: null })}
        member={viewMemberModal.member}
      />
    </div>
  );
}
