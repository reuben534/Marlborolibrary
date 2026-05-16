import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../api/client';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookUp,
  BookDown,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  History,
  FileText,
  Monitor,
  Activity,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'librarian', 'member'] },
    { icon: Users, label: 'Members', path: '/members', roles: ['admin', 'librarian'] },
    { icon: BookOpen, label: 'Books', path: '/books', roles: ['admin', 'librarian', 'member'] },
    { icon: BookUp, label: 'Borrow', path: '/borrow', roles: ['admin', 'librarian'] },
    { icon: BookDown, label: 'Return', path: '/return', roles: ['admin', 'librarian'] },
    { icon: Monitor, label: 'Computers', path: '/computer-booking', roles: ['admin', 'librarian'] },
    { icon: History, label: 'History', path: '/history', roles: ['admin', 'librarian'] },
    { icon: FileText, label: 'Reports', path: '/reports', roles: ['admin', 'librarian'] },
    { icon: Activity, label: 'Audit Trail', path: '/audit-trail', roles: ['admin'] },
    { icon: UserCog, label: 'Profile', path: '/profile', roles: ['admin', 'librarian', 'member'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || 'member')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[#1B5E4B] flex-col">
        <div className="p-6">
          <h1 className="text-white text-xl font-bold">Marlboro Library</h1>
          <p className="text-green-200 text-sm mt-1">Digital Management</p>
        </div>

        <nav className="flex-1 px-3">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-green-100 hover:bg-white/10'
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold overflow-hidden">
              {user?.photo || user?.role ? (
                <img
                  src={user?.photo ? `${IMAGE_BASE_URL}${user.photo}` : `${IMAGE_BASE_URL}/images/${user?.role === 'admin' ? 'Admin' : user?.role === 'librarian' ? 'Librarian' : 'Member'}.jpg`}
                  alt={user?.fullName}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.insertAdjacentText('beforeend', user?.fullName.charAt(0) || '');
                  }}
                />
              ) : (
                user?.fullName.charAt(0)
              )}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.fullName}</p>
              <p className="text-green-200 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-green-100 hover:bg-white/10 transition-colors"
          >
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1B5E4B] flex items-center justify-between px-4 z-30">
        <h1 className="text-white text-lg font-bold">Marlboro Library</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#1B5E4B] z-20 p-4 overflow-y-auto">
          <nav className="mb-6">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                {user?.photo || user?.role ? (
                  <img
                    src={user?.photo ? `${IMAGE_BASE_URL}${user.photo}` : `${IMAGE_BASE_URL}/images/${user?.role === 'admin' ? 'Admin' : user?.role === 'librarian' ? 'Librarian' : 'Member'}.jpg`}
                    alt={user?.fullName}
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.insertAdjacentText('beforeend', user?.fullName.charAt(0) || '');
                    }}
                  />
                ) : (
                  user?.fullName.charAt(0)
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user?.fullName}</p>
                <p className="text-green-200 text-sm capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-green-100 hover:bg-white/10 transition-colors"
            >
              <LogOut className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}