'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextType {
  appTitle: string;
  setAppTitle: (title: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appTitle, setAppTitle] = useState('ContaSimples');

  return (
    <AppContext.Provider value={{ appTitle, setAppTitle }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
