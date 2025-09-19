
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Transaction, Budget, SavingsGoal, Subscription, Category, Bill } from '@/lib/types';
import { 
    transactions as initialTransactionsData, 
    budgets as initialBudgetsData, 
    savingsGoals as initialSavingsGoalsData,
    subscriptions as initialSubscriptionsData,
    bills as initialBillsData
} from '@/lib/data';
import { categoryIcons } from '@/lib/icons';
import { useAuth } from './AuthContext';

const initialCategories = Object.keys(categoryIcons) as Category[];

interface DataContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
  bills: Bill[];
  categories: Category[];
  addCategory: (category: Category) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  applyBudgetSuggestions: (suggestedBudgets: Record<string, number>) => void;
  addBill: (bill: Omit<Bill, 'id' | 'status'>) => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item, (key, value) => {
                if ((key === 'date' || key === 'dueDate' || key === 'nextPaymentDate') && value) {
                    return new Date(value);
                }
                return value;
            });
        }
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
    }
    return defaultValue;
};

const saveToLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key “${key}”:`, error);
    }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid;
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const userKey = `data_${userId}`;
      const userData = loadFromLocalStorage<any>(userKey, null);

      if (userData) {
        setTransactions(userData.transactions || []);
        setBudgets(userData.budgets || []);
        setSavingsGoals(userData.savingsGoals || []);
        setSubscriptions(userData.subscriptions || []);
        setBills(userData.bills || []);
        setCategories(userData.categories || initialCategories);
      } else {
        // New user or example user logging in for the first time
        const isExample = user?.isExample;
        const initialData = {
          transactions: isExample ? initialTransactionsData : [],
          budgets: isExample ? initialBudgetsData : [],
          savingsGoals: isExample ? initialSavingsGoalsData : [],
          subscriptions: isExample ? initialSubscriptionsData : [],
          bills: isExample ? initialBillsData : [],
          categories: initialCategories,
        };
        setTransactions(initialData.transactions);
        setBudgets(initialData.budgets);
        setSavingsGoals(initialData.savingsGoals);
        setSubscriptions(initialData.subscriptions);
        setBills(initialData.bills);
        setCategories(initialData.categories);
        saveToLocalStorage(userKey, initialData);
      }
      setIsLoading(false);
    } else {
      // No user, clear all data
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setSubscriptions([]);
      setBills([]);
      setCategories(initialCategories);
    }
  }, [userId, user?.isExample]);

  // Save all data to a single user-specific key whenever anything changes
  useEffect(() => {
    if (!isLoading && userId) {
      const userData = { transactions, budgets, savingsGoals, subscriptions, bills, categories };
      saveToLocalStorage(`data_${userId}`, userData);
    }
  }, [transactions, budgets, savingsGoals, subscriptions, bills, categories, isLoading, userId]);


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

  const updateSavingsGoal = (goal: SavingsGoal) => {
    setSavingsGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
  }

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
        const existingCategories = updatedBudgets.map(b => b.category.toLowerCase().replace(' ', ''));
        Object.entries(suggestedBudgets).forEach(([categoryKey, amount]) => {
            if (!existingCategories.includes(categoryKey)) {
                updatedBudgets.push({
                    id: Date.now().toString() + categoryKey,
                    category: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
                    amount,
                    spent: 0,
                });
            }
        });
        return updatedBudgets;
    });
  };

  const addBill = (bill: Omit<Bill, 'id' | 'status'>) => {
    const newBillBase = { ...bill, id: Date.now().toString(), status: 'pending' as const };
    if (bill.installments && bill.installments.total > 1) {
        const installmentBills: Bill[] = [];
        for (let i = 0; i < bill.installments.total; i++) {
            const dueDate = new Date(bill.dueDate);
            dueDate.setMonth(dueDate.getMonth() + i);
            installmentBills.push({
                ...newBillBase,
                id: `${newBillBase.id}-${i}`,
                description: `${bill.description} (${i + 1}/${bill.installments.total})`,
                amount: bill.amount / bill.installments.total,
                dueDate: dueDate,
                installments: { current: i + 1, total: bill.installments.total }
            });
        }
        setBills(prev => [...prev, ...installmentBills].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
    } else {
        setBills(prev => [...prev, newBillBase].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
    }
  };

  const updateBill = (bill: Bill) => {
    setBills(prev => prev.map(b => b.id === bill.id ? bill : b).sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
    if(bill.status === 'paid' && !transactions.some(t => t.billId === bill.id)) {
        addTransaction({
            description: `Pagamento: ${bill.description}`,
            amount: bill.amount,
            type: bill.type === 'payable' ? 'expense' : 'income',
            category: 'Contas',
            billId: bill.id,
        })
    }
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const value = {
    transactions,
    budgets,
    savingsGoals,
    subscriptions,
    bills,
    categories,
    addCategory,
    addTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    updateBudget,
    deleteBudget,
    applyBudgetSuggestions,
    addBill,
    updateBill,
    deleteBill,
  };

  if (isLoading) {
    return null;
  }

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
