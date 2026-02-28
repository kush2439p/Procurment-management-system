import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import API from '@/api/axiosInstance';

interface AuthState {
  token: string | null;
  username: string | null;
  userId: number | null;
  roles: string[];
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  demoLogin: () => void;
  register: (username: string, password: string) => Promise<string>;
  logout: () => void;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isProcMgr: () => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem('procurementToken'),
    username: localStorage.getItem('procurementUser'),
    userId: localStorage.getItem('procurementUserId') ? Number(localStorage.getItem('procurementUserId')) : null,
    roles: JSON.parse(localStorage.getItem('procurementRoles') || '[]'),
  }));

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await API.post('/api/auth/login', { username, password });
    localStorage.setItem('procurementToken', data.token);
    localStorage.setItem('procurementUser', data.username);
    localStorage.setItem('procurementUserId', String(data.id));
    localStorage.setItem('procurementRoles', JSON.stringify(data.roles));
    setAuth({ token: data.token, username: data.username, userId: data.id, roles: data.roles });
  }, []);

  const demoLogin = useCallback(() => {
    const demoRoles = ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_PROCUREMENT_MANAGER'];
    localStorage.setItem('procurementToken', 'demo-token');
    localStorage.setItem('procurementUser', 'demo_admin');
    localStorage.setItem('procurementUserId', '1');
    localStorage.setItem('procurementRoles', JSON.stringify(demoRoles));
    setAuth({ token: 'demo-token', username: 'demo_admin', userId: 1, roles: demoRoles });
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const { data } = await API.post('/api/auth/register', { username, password });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('procurementToken');
    localStorage.removeItem('procurementRoles');
    localStorage.removeItem('procurementUser');
    localStorage.removeItem('procurementUserId');
    setAuth({ token: null, username: null, userId: null, roles: [] });
  }, []);

  const isAdmin = () => auth.roles.includes('ROLE_ADMIN');
  const isManager = () => auth.roles.includes('ROLE_MANAGER') || isAdmin();
  const isProcMgr = () => auth.roles.includes('ROLE_PROCUREMENT_MANAGER') || isAdmin();

  return (
    <AuthContext.Provider value={{
      ...auth,
      login, demoLogin, register, logout,
      isAdmin, isManager, isProcMgr,
      isAuthenticated: !!auth.token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
