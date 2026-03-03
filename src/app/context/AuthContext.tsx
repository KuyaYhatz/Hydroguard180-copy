import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUsers } from '../utils/database';

export type UserRole = 'Super Admin' | 'Admin' | 'Staff';

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hydroguard_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Validate that the stored user still exists and is active
        const valid = getUsers().find(
          (u) => u.id === parsed.id && u.status === 'active'
        );
        if (valid) {
          setUser(parsed);
        } else {
          localStorage.removeItem('hydroguard_user');
        }
      } catch {
        localStorage.removeItem('hydroguard_user');
      }
    }
  }, []);

  const login = (username: string, password: string): { success: boolean; error?: string } => {
    const allUsers = getUsers();
    const foundUser = allUsers.find(
      (u: any) => (u.username === username || u.email === username) && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid username or password.' };
    }

    if (foundUser.status !== 'active') {
      return { success: false, error: 'Your account has been deactivated. Contact an administrator.' };
    }

    const userSession: User = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role as UserRole,
      fullName: foundUser.fullName,
      status: foundUser.status,
    };
    setUser(userSession);
    localStorage.setItem('hydroguard_user', JSON.stringify(userSession));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hydroguard_user');
  };

  const hasRole = (...roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
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