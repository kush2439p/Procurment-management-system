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
  vendorLogin: (email: string, password: string) => Promise<void>;
  demoLogin: () => void;
  register: (username: string, password: string, fullName: string, email: string, role: string) => Promise<string>;
  vendorRegister: (data: any) => Promise<string>;
  logout: () => void;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isProcMgr: () => boolean;
  isVendor: () => boolean;
  isEmployee: () => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

// ✅ Helper — safely extracts role strings from WHATEVER backend sends
// Handles: ["ROLE_ADMIN"], [{name:"ROLE_ADMIN"}], [{id:1,name:"ROLE_ADMIN"}]
function extractRoles(rawRoles: any): string[] {
  if (!rawRoles || !Array.isArray(rawRoles)) return [];

  return rawRoles
    .map((r: any) => {
      if (typeof r === 'string') return r;           // already a string
      if (r && typeof r === 'object' && r.name) return r.name;  // object with name
      if (r && typeof r === 'object' && r.authority) return r.authority; // Spring default
      return null;
    })
    .filter(Boolean) as string[];
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    // ✅ Also fix roles on initial load from localStorage
    const rawRoles = JSON.parse(localStorage.getItem('procurementRoles') || '[]');
    return {
      token: localStorage.getItem('procurementToken'),
      username: localStorage.getItem('procurementUser'),
      userId: localStorage.getItem('procurementUserId')
        ? Number(localStorage.getItem('procurementUserId'))
        : null,
      roles: extractRoles(rawRoles),
    };
  });

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await API.post('/api/auth/login', { username, password });

    // ✅ THE FIX — always extract strings no matter what backend sends
    const roles = extractRoles(data.roles);

    localStorage.setItem('procurementToken', data.token);
    localStorage.setItem('procurementUser', data.username);
    localStorage.setItem('procurementUserId', String(data.id ?? data.userId ?? ''));
    localStorage.setItem('procurementRoles', JSON.stringify(roles));

    setAuth({
      token: data.token,
      username: data.username,
      userId: data.id ?? data.userId ?? null,
      roles,  // ✅ always clean string array
    });
  }, []);

  const vendorLogin = useCallback(async (email: string, password: string) => {
    const { data } = await API.post('/api/vendor-auth/login', { email, password });

    // ✅ Same fix for vendor login
    const roles = extractRoles(data.roles);

    localStorage.setItem('procurementToken', data.token);
    localStorage.setItem('procurementUser', data.email);
    localStorage.setItem('procurementUserId', String(data.vendorId ?? data.id ?? ''));
    localStorage.setItem('procurementRoles', JSON.stringify(roles));

    setAuth({
      token: data.token,
      username: data.email,
      userId: data.vendorId ?? data.id ?? null,
      roles,  // ✅ always clean string array
    });
  }, []);

  const demoLogin = useCallback(() => {
    const roles = ['ROLE_ADMIN', 'ROLE_PROCUREMENT_MANAGER'];
    localStorage.setItem('procurementToken', 'demo-token');
    localStorage.setItem('procurementUser', 'demo_admin');
    localStorage.setItem('procurementUserId', '1');
    localStorage.setItem('procurementRoles', JSON.stringify(roles));
    setAuth({ token: 'demo-token', username: 'demo_admin', userId: 1, roles });
  }, []);

  const register = useCallback(async (username: string, password: string, fullName: string, email: string, role: string) => {
    const { data } = await API.post('/api/auth/register', { username, password, fullName, email, role });
    return typeof data === 'string' ? data : data.message;
  }, []);

  const vendorRegister = useCallback(async (formData: any) => {
    const { data } = await API.post('/api/vendor-auth/register', formData);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('procurementToken');
    localStorage.removeItem('procurementRoles');
    localStorage.removeItem('procurementUser');
    localStorage.removeItem('procurementUserId');
    setAuth({ token: null, username: null, userId: null, roles: [] });
  }, []);

  // ✅ Role checks — clean and consistent
  const isAdmin = useCallback(() => auth.roles.includes('ROLE_ADMIN'), [auth.roles]);
  const isManager = useCallback(() => auth.roles.includes('ROLE_PROCUREMENT_MANAGER') || isAdmin(), [auth.roles]);
  const isProcMgr = useCallback(() => auth.roles.includes('ROLE_PROCUREMENT_MANAGER') || isAdmin(), [auth.roles]);
  const isVendor = useCallback(() => auth.roles.includes('ROLE_VENDOR'), [auth.roles]);
  const isEmployee = useCallback(() => auth.roles.includes('ROLE_EMPLOYEE') && !isAdmin() && !isProcMgr(), [auth.roles]);

  return (
    <AuthContext.Provider value={{
      ...auth,
      login, vendorLogin, demoLogin, register, vendorRegister, logout,
      isAdmin, isManager, isProcMgr, isVendor, isEmployee,
      isAuthenticated: !!auth.token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};