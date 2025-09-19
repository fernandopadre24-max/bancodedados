
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define a simplified user type for our mock
export interface MockUser {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    isAnonymous: boolean;
    photoURL: string | null;
    metadata: {
        creationTime?: string;
        lastSignInTime?: string;
    };
    providerId: string;
    tenantId: string | null;
    password?: string;
    isExample?: boolean;
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
        metadata: {},
        providerId: 'password',
        tenantId: null,
        isExample: true,
        password: 'admin',
    },
    {
        uid: 'mock-user-uid-user1',
        email: 'user1@contasimples.com',
        emailVerified: true,
        displayName: 'Usuário Padrão',
        isAnonymous: false,
        photoURL: 'https://picsum.photos/seed/user-avatar-user1/40/40',
        metadata: {},
        providerId: 'password',
        tenantId: null,
        isExample: true,
    },
];

interface AuthContextType {
  user: MockUser | null;
  users: MockUser[];
  loading: boolean;
  login: (user: MockUser) => void;
  logout: () => void;
  signup: (details: { displayName: string; password: string }) => MockUser;
  updateUser: (user: MockUser) => Promise<void>;
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
    const storedUsers = loadFromLocalStorage<MockUser[]>('mock_users', initialMockUsers);
    setUsers(storedUsers);
    
    try {
        const sessionUserJson = sessionStorage.getItem('user');
        if (sessionUserJson) {
            setUser(JSON.parse(sessionUserJson));
        }
    } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem('user');
    }
    setLoading(false);

  }, []);

  const login = (userToLogin: MockUser) => {
    try {
        const userString = JSON.stringify(userToLogin);
        sessionStorage.setItem('user', userString);
        setUser(userToLogin);
    } catch(e) {
        console.error("Failed to stringify user or set to session storage", e);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };
  
  const signup = (details: { displayName: string; password: string }): MockUser => {
    const existingUser = users.find(u => u.displayName === details.displayName);
    if (existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
    }

    const newUser: MockUser = {
        uid: `mock-user-uid-${Date.now()}`,
        email: `${details.displayName.toLowerCase().replace(/\s/g, '')}@contasimples.com`,
        displayName: details.displayName,
        password: details.password,
        emailVerified: true,
        isAnonymous: false,
        photoURL: `https://picsum.photos/seed/${details.displayName}/40/40`,
        metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        },
        providerId: 'password',
        tenantId: null,
        isExample: false,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToLocalStorage('mock_users', updatedUsers);
    login(newUser);
    return newUser;
  };

  const updateUser = async (updatedUser: MockUser): Promise<void> => {
    const updatedUsers = users.map(u => u.uid === updatedUser.uid ? updatedUser : u);
    setUsers(updatedUsers);
    saveToLocalStorage('mock_users', updatedUsers);
    login(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, users, loading, login, logout, signup, updateUser }}>
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
