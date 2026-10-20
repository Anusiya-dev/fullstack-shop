import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchMe, loginUser, logoutUser, registerUser } from '../services/api';
import { clearAuth, getStoredUser, getToken, saveAuth } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
      localStorage.setItem('floraUser', JSON.stringify(me));
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    const onAuthChange = () => refreshUser();
    window.addEventListener('authChanged', onAuthChange);
    return () => window.removeEventListener('authChanged', onAuthChange);
  }, [refreshUser]);

  async function login(username, password) {
    const data = await loginUser(username, password);
    saveAuth(data.token, data.user);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await registerUser(payload);
    saveAuth(data.token, data.user);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await logoutUser();
    } catch {
      /* clear local session even if API fails */
    }
    clearAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
