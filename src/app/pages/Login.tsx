import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password, role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use: admin/librarian/member with password "password"');
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
>>>>>>> ac623c4 (created database)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B5E4B] to-[#0f3d2f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="size-16 bg-[#1B5E4B] rounded-full flex items-center justify-center mb-4">
              <BookOpen className="size-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Marlboro Library</h1>
            <p className="text-gray-600 text-sm mt-1">Digital Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
              >
                <option value="member">Member</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1B5E4B] text-white py-3 rounded-lg font-medium hover:bg-[#15523f] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-[#1B5E4B] hover:underline block"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#1B5E4B] hover:underline font-medium">
                Register
              </Link>
            </div>
          </div>

<<<<<<< HEAD
          {/* Demo Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-2">Demo credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Admin: <span className="font-mono">admin / password</span></p>
              <p>• Librarian: <span className="font-mono">librarian / password</span></p>
              <p>• Member: <span className="font-mono">member / password</span></p>
            </div>
          </div>
=======
>>>>>>> ac623c4 (created database)
        </div>
      </div>
    </div>
  );
}