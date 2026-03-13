import React, { createContext, useCallback, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authMode, setAuthMode] = useState('bearer'); // 'bearer' | 'apikey' | 'session'

  const login = useCallback((tokens, userData) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    const u = userData || { email: '' };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    setAuthMode('bearer');
  }, []);

  const loginWithApiKey = useCallback((key) => {
    localStorage.setItem('apiKey', key);
    localStorage.setItem('user', JSON.stringify({ email: 'api-key-user' }));
    setUser({ email: 'api-key-user' });
    setAuthMode('apikey');
  }, []);

  const loginWithSession = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData || { email: 'session-user' }));
    setUser(userData || { email: 'session-user' });
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

export function useAuth() {
  return useContext(AuthContext);
}
