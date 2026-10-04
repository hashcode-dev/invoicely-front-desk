import React, { createContext, useContext, useState } from 'react';

export type AuthUser = {
  email: string;
  name: string;
  avatar: string;
  picture?: string;
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
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  function login(u: AuthUser) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    localStorage.setItem('X-NINJA-TOKEN', 'demo-token');
    setUser(u);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('X-NINJA-TOKEN');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
