<<<<<<< HEAD
import { createContext, useContext, useState, ReactNode } from 'react';
=======
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '../api/client';
>>>>>>> ac623c4 (created database)

export type UserRole = 'admin' | 'librarian' | 'member';

export interface User {
<<<<<<< HEAD
  id: string;
=======
  _id: string;
>>>>>>> ac623c4 (created database)
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
<<<<<<< HEAD
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  register: (data: RegisterData) => boolean;
  updateProfile: (data: Partial<User>) => void;
=======
  loading: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
>>>>>>> ac623c4 (created database)
}

export interface RegisterData {
  fullName: string;
  username: string;
<<<<<<< HEAD
=======
  email: string;
>>>>>>> ac623c4 (created database)
  password: string;
  confirmPassword: string;
  role: UserRole;
  photo?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

<<<<<<< HEAD
// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@library.com',
    phone: '+44 20 7946 0958',
    role: 'admin',
  },
  {
    id: '2',
    username: 'librarian',
    fullName: 'John Librarian',
    email: 'librarian@library.com',
    phone: '+44 20 7946 0959',
    role: 'librarian',
  },
  {
    id: '3',
    username: 'member',
    fullName: 'Jane Member',
    email: 'member@library.com',
    phone: '+44 20 7946 0960',
    role: 'member',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // Mock login - password is 'password' for all users
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.role === role
    );
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (data: RegisterData): boolean => {
    if (data.password !== data.confirmPassword) {
      return false;
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: data.username,
      fullName: data.fullName,
      email: `${data.username}@library.com`,
      phone: '+0000000000',
      role: data.role,
      photo: data.photo,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
=======
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
>>>>>>> ac623c4 (created database)
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
<<<<<<< HEAD
}
=======
}
>>>>>>> ac623c4 (created database)
