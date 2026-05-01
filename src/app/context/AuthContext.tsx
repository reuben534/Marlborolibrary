import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '../api/client';

export type UserRole = 'admin' | 'librarian' | 'member';

export interface User {
  _id: string; // using backend ID
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  photo?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiClient('/auth/profile');
          setUser(userData);
        } catch (error) {
          console.error('Session expired', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string, role: UserRole) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const result = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('token', result.token);
    setUser(result);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await apiClient('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
