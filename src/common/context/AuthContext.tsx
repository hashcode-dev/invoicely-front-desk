import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthenticationTypes } from '$app/common/dtos/authentication';
import { authenticate, logout as logoutAction } from '$app/common/stores/slices/user';
import { RootState } from '$app/common/stores/store';

export type AuthUser = {
  email: string;
  name: string;
  avatar: string;
  picture?: string;
  role?: 'organization' | 'employee' | 'admin' | 'owner';
  is_employee?: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'invoicely_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.user);

  const login = (u: AuthUser) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    localStorage.setItem('X-NINJA-TOKEN', 'demo-token');
    dispatch(
      authenticate({
        type: AuthenticationTypes.TOKEN,
        user: { ...u, id: u.is_employee ? 'demo-employee-id' : 'demo-user-id' } as any,
        token: 'demo-token',
      })
    );
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('X-NINJA-TOKEN');
    dispatch(logoutAction());
  };

  let sessionUser: AuthUser | null = null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) sessionUser = JSON.parse(raw);
  } catch {
    // Ignore invalid JSON
  }

  const currentUser: AuthUser | null =
    reduxUser.authenticated && reduxUser.user?.email
      ? {
          email: reduxUser.user.email,
          name:
            `${reduxUser.user.first_name || ''} ${reduxUser.user.last_name || ''}`.trim() ||
            reduxUser.user.email,
          avatar: (reduxUser.user.first_name || reduxUser.user.email || 'U').slice(0, 2).toUpperCase(),
          picture: reduxUser.user.avatar,
          role: reduxUser.user.is_employee ? 'employee' : 'organization',
          is_employee: Boolean(reduxUser.user.is_employee),
        }
      : sessionUser;

  const isAuthenticated = reduxUser.authenticated || Boolean(sessionUser);

  return (
    <AuthContext.Provider value={{ user: currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
