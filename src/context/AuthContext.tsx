
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';

// Define a simplified user type for our mock
export interface MockUser extends Omit<User, 'providerData' | 'toJSON' | 'delete' | 'getIdToken' | 'getIdTokenResult' | 'reload'> {
    // Add any custom fields if necessary
}

// Initial mock users for development
const initialMockUsers: MockUser[] = [
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
  users: MockUser[];
  loading: boolean;
  login: (user: MockUser) => void;
  logout: () => void;
  signup: (details: { displayName: string; email: string }) => MockUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get data from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

// Helper function to save data to localStorage
const saveToLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key “${key}”:`, error);
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage, or use initial list if none found
    const storedUsers = loadFromLocalStorage<MockUser[]>('mock_users', []);
    if (storedUsers.length === 0) {
      setUsers(initialMockUsers);
      saveToLocalStorage('mock_users', initialMockUsers);
    } else {
      setUsers(storedUsers);
    }
    
    // Check for a user in sessionStorage
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

  useEffect(() => {
    // This effect runs only when `users` state changes, preventing unnecessary writes.
    // It avoids running on initial mount before `users` is properly initialized.
    if (users.length > 0) {
      saveToLocalStorage('mock_users', users);
    }
  }, [users]);


  const login = (userToLogin: MockUser) => {
    sessionStorage.setItem('user', JSON.stringify(userToLogin));
    setUser(userToLogin);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };
  
  const signup = (details: { displayName: string; email: string }): MockUser => {
    const newUser: MockUser = {
        uid: `mock-user-uid-${Date.now()}`,
        email: details.email,
        displayName: details.displayName,
        emailVerified: true,
        isAnonymous: false,
        photoURL: `https://picsum.photos/seed/${details.displayName}/40/40`,
        metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        },
        providerId: 'password',
        tenantId: null,
    };
    setUsers(prev => [...prev, newUser]);
    login(newUser); // Automatically log in the new user
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, users, loading, login, logout, signup }}>
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
