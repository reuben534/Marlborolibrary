import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import {
  ProtectedRoute,
  AdminRoute,
  LibrarianOrAdminRoute,
} from './guards';
import type { User } from './context/AuthContext';

vi.mock('./components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

const mockUser: User = {
  _id: '1',
  username: 'testuser',
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '',
  role: 'member',
};

vi.mock('./context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from './context/AuthContext';

function renderGuard(
  Guard: typeof ProtectedRoute,
  initialPath = '/protected',
  outlet = <div>Secret content</div>
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/protected" element={<Guard>{outlet}</Guard>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('route guards', () => {
  it('ProtectedRoute redirects unauthenticated users to login', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderGuard(ProtectedRoute);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('ProtectedRoute renders children when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderGuard(ProtectedRoute);
    expect(screen.getByText('Secret content')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('AdminRoute redirects non-admin users to dashboard', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { ...mockUser, role: 'librarian' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderGuard(AdminRoute);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('LibrarianOrAdminRoute blocks members', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderGuard(LibrarianOrAdminRoute);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('LibrarianOrAdminRoute allows librarians', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { ...mockUser, role: 'librarian' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderGuard(LibrarianOrAdminRoute);
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });
});
