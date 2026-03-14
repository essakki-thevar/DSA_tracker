"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (username: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from cookie on mount
  useEffect(() => {
    // Read username from non-httponly cookie
    const username = document.cookie
      .split('; ')
      .find(row => row.startsWith('dsa_username='))
      ?.split('=')[1];

    if (username) {
      // Fetch full user data
      fetch('/api/user')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && !data.error) {
            // Get username from cookie since API doesn't return it
            setUser({ id: 0, username: decodeURIComponent(username), email: '' });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || 'Login failed';
      setUser(data);
      return null;
    } catch {
      return 'Network error';
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || 'Registration failed';
      setUser(data);
      return null;
    } catch {
      return 'Network error';
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

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
