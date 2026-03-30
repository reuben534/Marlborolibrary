import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { BookOpen, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setSent(true);
    toast.success('Password reset instructions sent to your email!');
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
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
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-600 text-sm mt-1 text-center">
              {sent 
                ? "Check your email for reset instructions"
                : "Enter your email to reset your password"
              }
            </p>
          </div>

          {!sent ? (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E4B] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1B5E4B] text-white py-3 rounded-lg font-medium hover:bg-[#15523f] transition-colors"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-[#1B5E4B] hover:underline font-medium"
                >
                  <ArrowLeft className="size-4" />
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="size-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  We've sent password reset instructions to:
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
                <p className="text-sm text-gray-600">
                  Please check your email and follow the link to reset your password.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-[#1B5E4B] hover:underline font-medium mt-4"
              >
                <ArrowLeft className="size-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
