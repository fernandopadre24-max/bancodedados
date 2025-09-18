
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';

// Define a simplified user type for our mock
export interface MockUser extends Omit<User, 'providerData' | 'toJSON' | 'delete' | 'getIdToken' | 'getIdTokenResult' | 'reload'> {
    // Add any custom fields if necessary
}

// Mock users for development without real Firebase config
export const mockUsers: MockUser[] = [
    {
        uid: 'mock-user-uid-admin',
        email: 'admin@contasimples.com',
        emailVerified: true,
        displayName: 'Administrador',
        isAnonymous: false,
        photoURL: 'https://picsum.photos/seed/user-avatar-admin/40/40',
        metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        },
        providerId: 'password',
        tenantId: null,
    },
    {
        uid: 'mock-user-uid-user1',
        email: 'user1@contasimples.com',
        emailVerified: true,
        displayName: 'Usuário Padrão',
        isAnonymous: false,
        photoURL: 'https://picsum.photos/seed/user-avatar-user1/40/40',
        metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        },
        providerId: 'password',
        tenantId: null,
    },
];


interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (user: MockUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
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

  }, []);

  const login = (userToLogin: MockUser) => {
    sessionStorage.setItem('user', JSON.stringify(userToLogin));
    setUser(userToLogin);
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
