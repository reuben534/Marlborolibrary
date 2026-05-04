import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, IMAGE_BASE_URL } from '../api/client';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const getRoleImage = () => {
    switch (user?.role) {
      case 'admin': return `${IMAGE_BASE_URL}/images/Admin.jpg`;
      case 'librarian': return `${IMAGE_BASE_URL}/images/Librarian.jpg`;
      default: return `${IMAGE_BASE_URL}/images/Member.jpg`;
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const result = await apiClient('/upload', {
        method: 'POST',
        body: formData as any,
        headers: {
          'Content-Type': '',
        }
      });
      await updateProfile({ photo: result.url });
      toast.success('Profile photo updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload photo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1B5E4B] to-[#15523f] h-32"></div>
        <div className="px-4 md:px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="size-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-[#1B5E4B] text-4xl font-bold overflow-hidden">
                <img
                  src={user?.photo ? `${IMAGE_BASE_URL}${user.photo}` : getRoleImage()}
                  alt={user?.fullName}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.insertAdjacentText('beforeend', user?.fullName.charAt(0) || '');
                  }}
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-[#1B5E4B] rounded-full p-3 text-white shadow-lg hover:bg-[#15523f] transition-colors cursor-pointer">
                <Camera className="size-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1 pt-16 sm:pt-0">
              <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start">
                <div className="text-sm">
                  <span className="text-gray-500">Email:</span>{' '}
                  <span className="text-gray-900 font-medium">{user?.email}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Telefone:</span>{' '}
                  <span className="text-gray-900 font-medium">{user?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Information</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={user?.role}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 capitalize"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors"
            >
              <Save className="size-5" />
              Save Changes
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Stats (if not member) */}
      {user?.role !== 'member' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm text-gray-600 mb-2">Books Borrowed</h4>
            <p className="text-3xl font-bold text-[#1B5E4B]">234</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm text-gray-600 mb-2">Books Returned</h4>
            <p className="text-3xl font-bold text-blue-600">189</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm text-gray-600 mb-2">Total Processed</h4>
            <p className="text-3xl font-bold text-purple-600">423</p>
          </div>
        </div>
      )}
    </div>
  );
}