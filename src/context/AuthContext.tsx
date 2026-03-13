import React, { createContext, useCallback, useContext, useState } from 'react';
import { AuthMode, Tokens, User } from '../types';

interface AuthContextType {
  user: User | null;
  authMode: AuthMode;
  login: (tokens: Tokens, userData?: Partial<User>) => void;
  loginWithApiKey: (key: string) => void;
  loginWithSession: (userData?: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [authMode, setAuthMode] = useState<AuthMode>('bearer');

  const login = useCallback((tokens: Tokens, userData?: Partial<User>) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    const u: User = { email: '', ...userData };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    setAuthMode('bearer');
  }, []);

  const loginWithApiKey = useCallback((key: string) => {
    localStorage.setItem('apiKey', key);
    const u: User = { email: 'api-key-user' };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    setAuthMode('apikey');
  }, []);

  const loginWithSession = useCallback((userData?: Partial<User>) => {
    const u: User = { email: 'session-user', ...userData };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    setAuthMode('session');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('user');
    setUser(null);
    setAuthMode('bearer');
  }, []);

  return (
    <AuthContext.Provider value={{ user, authMode, login, loginWithApiKey, loginWithSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
