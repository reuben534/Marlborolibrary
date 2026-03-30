import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { MemberDashboard } from './pages/MemberDashboard';
import { Profile } from './pages/Profile';
import { Members } from './pages/Members';
import { Books } from './pages/Books';
import { Borrow } from './pages/Borrow';
import { Return } from './pages/Return';
import { BorrowHistory } from './pages/BorrowHistory';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { ComputerBooking } from './pages/ComputerBooking';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function LibrarianOrAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'member') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function DashboardRouter() {
  const { user } = useAuth();
  
  // Members see their own dashboard
  if (user?.role === 'member') {
    return <MemberDashboard />;
  }
  
  // Admin and Librarian see the full dashboard
  return <Dashboard />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/members',
    element: (
      <LibrarianOrAdminRoute>
        <Members />
      </LibrarianOrAdminRoute>
    ),
  },
  {
    path: '/books',
    element: (
      <ProtectedRoute>
        <Books />
      </ProtectedRoute>
    ),
  },
  {
    path: '/borrow',
    element: (
      <LibrarianOrAdminRoute>
        <Borrow />
      </LibrarianOrAdminRoute>
    ),
  },
  {
    path: '/return',
    element: (
      <LibrarianOrAdminRoute>
        <Return />
      </LibrarianOrAdminRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <LibrarianOrAdminRoute>
        <BorrowHistory />
      </LibrarianOrAdminRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <LibrarianOrAdminRoute>
        <Reports />
      </LibrarianOrAdminRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <AdminRoute>
        <Settings />
      </AdminRoute>
    ),
  },
  {
    path: '/computer-booking',
    element: (
      <LibrarianOrAdminRoute>
        <ComputerBooking />
      </LibrarianOrAdminRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);