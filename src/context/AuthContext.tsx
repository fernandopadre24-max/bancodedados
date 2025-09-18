
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development without real Firebase config
const mockUser: User = {
    uid: 'mock-user-uid',
    email: 'dev@contasimples.com',
    emailVerified: true,
    displayName: 'Admin',
    isAnonymous: false,
    photoURL: 'https://picsum.photos/seed/user-avatar/40/40',
    providerData: [],
    metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
    },
    providerId: 'password',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({
        token: 'mock-token',
        expirationTime: new Date().toISOString(),
        authTime: new Date().toISOString(),
        issuedAtTime: new Date().toISOString(),
        signInProvider: 'password',
        signInSecondFactor: null,
        claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect ensures that the user state is initialized correctly from sessionStorage.
    try {
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        }
    } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem('user');
    }
    setLoading(false);

    // Note: Firebase onAuthStateChanged logic would go here for a real implementation
    // For this mock setup, we manage the state manually via login/logout.

  }, []);

  const login = () => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
