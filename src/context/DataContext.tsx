
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Transaction, Budget, SavingsGoal, Subscription, Category } from '@/lib/types';
import { 
    transactions as initialTransactions, 
    budgets as initialBudgets, 
    savingsGoals as initialSavingsGoals,
    subscriptions as initialSubscriptions 
} from '@/lib/data';
import { categoryIcons } from '@/lib/icons';

const initialCategories = Object.keys(categoryIcons) as Category[];

interface DataContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  savingsGoals: SavingsGoal[];
  setSavingsGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  categories: Category[];
  addCategory: (category: Category) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteSavingsGoal: (id: string) => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  applyBudgetSuggestions: (suggestedBudgets: Record<string, number>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addCategory = (category: Category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [{...transaction, id: Date.now().toString(), date: new Date()}, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    setSavingsGoals(prev => [...prev, {...goal, id: Date.now().toString()}]);
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    setSubscriptions(prev => [...prev, {...subscription, id: Date.now().toString()}].sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime()));
  };
  
  const updateSubscription = (subscription: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === subscription.id ? subscription : s).sort((a,b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime()));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(prev => prev.map(b => b.id === budget.id ? budget : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const applyBudgetSuggestions = (suggestedBudgets: Record<string, number>) => {
    setBudgets(prev => {
        const updatedBudgets = prev.map(budget => {
            const suggestionKey = budget.category.toLowerCase().replace(' ', '');
            if (suggestedBudgets[suggestionKey]) {
                return { ...budget, amount: suggestedBudgets[suggestionKey] };
            }
            return budget;
        });
        return updatedBudgets;
    });
  };

  const value = {
    transactions,
    setTransactions,
    budgets,
    setBudgets,
    savingsGoals,
    setSavingsGoals,
    subscriptions,
    setSubscriptions,
    categories,
    addCategory,
    addTransaction,
    deleteTransaction,
    addSavingsGoal,
    deleteSavingsGoal,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    updateBudget,
    deleteBudget,
    applyBudgetSuggestions,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
