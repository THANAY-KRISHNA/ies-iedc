import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchRoleUser: (role: UserRole) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('iedc_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res?.user) {
          setUser(res.user);
        } else {
          // Token invalid
          localStorage.removeItem('iedc_admin_token');
          setToken(null);
        }
      } catch {
        // Fallback for demo: default to Super Admin
        const fallbackUser: User = {
          id: 'usr_super',
          name: 'Prof. Shahaziya Parvez',
          email: 'nodal.officer@iesce.info',
          role: 'Super Admin',
          lastLogin: new Date().toISOString()
        };
        setUser(fallbackUser);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await api.login(email);
      if (res?.user && res?.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('iedc_admin_token', res.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('iedc_admin_token');
  };

  const switchRoleUser = async (role: UserRole) => {
    const roleToEmail: Record<UserRole, string> = {
      'Super Admin': 'nodal.officer@iesce.info',
      'Content Admin': 'content.iedc@iesce.info',
      'Team Admin': 'team.iedc@iesce.info',
      'Achievement Admin': 'achievements.iedc@iesce.info'
    };
    await login(roleToEmail[role]);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, switchRoleUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
