import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { IMAGE_BASE_URL, uploadPhoto } from '../api/client';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const getRoleImage = () => {
    switch (user?.role) {
      case 'admin':
        return `${IMAGE_BASE_URL}/images/Admin.jpg`;
      case 'librarian':
        return `${IMAGE_BASE_URL}/images/Librarian.jpg`;
      default:
        return `${IMAGE_BASE_URL}/images/Member.jpg`;
    }
  };

  const avatarSrc =
    photoPreview ||
    (user?.photo ? `${IMAGE_BASE_URL}${user.photo}` : getRoleImage());

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return previewUrl;
    });

    setUploadingPhoto(true);
    try {
      const { url } = await uploadPhoto(file);
      await updateProfile({ photo: url });
      setPhotoPreview(null);
      toast.success('Profile photo updated!');
    } catch (err) {
      setPhotoPreview(null);
      toast.error(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    }
    setPhotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1B5E4B] to-[#15523f] h-32" />
        <div className="px-4 md:px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
            <div className="relative">
              <div className="size-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-[#1B5E4B] text-4xl font-bold overflow-hidden">
                <img
                  key={user?.photo || 'default'}
                  src={avatarSrc}
                  alt={user?.fullName}
                  className="size-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = getRoleImage();
                  }}
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="size-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label
                className={`absolute bottom-0 right-0 bg-[#1B5E4B] rounded-full p-3 text-white shadow-lg transition-colors ${
                  uploadingPhoto
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-[#15523f] cursor-pointer'
                }`}
                title="Change profile photo"
              >
                {uploadingPhoto ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Camera className="size-5" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>

            <div className="text-center sm:text-left flex-1 pt-16 sm:pt-0">
              <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <p className="text-sm text-gray-500 mt-2">
                Click the camera icon to upload a new profile picture (max 5MB)
              </p>
              <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start">
                <div className="text-sm">
                  <span className="text-gray-500">Email:</span>{' '}
                  <span className="text-gray-900 font-medium">{user?.email}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Phone:</span>{' '}
                  <span className="text-gray-900 font-medium">{user?.phone || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              disabled={savingProfile}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E4B] text-white rounded-lg font-medium hover:bg-[#15523f] transition-colors disabled:opacity-60"
            >
              {savingProfile ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Save className="size-5" />
              )}
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

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