import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'librarian' | 'member';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  register: (data: RegisterData) => boolean;
  updateProfile: (data: Partial<User>) => void;
}

export interface RegisterData {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  photo?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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