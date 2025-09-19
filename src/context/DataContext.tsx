
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
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  savingsGoals: SavingsGoal[];
  setSavingsGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
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
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to get data from localStorage
const loadFromLocalStorage = <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            // Dates are stored as strings, so we need to parse them back
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
    return null;
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

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid;
  const isExampleUser = user?.isExample ?? false;

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);


  // Load data when user logs in
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      
      const transactionsData = loadFromLocalStorage<Transaction[]>(`transactions_${userId}`);
      const budgetsData = loadFromLocalStorage<Budget[]>(`budgets_${userId}`);
      const savingsGoalsData = loadFromLocalStorage<SavingsGoal[]>(`savingsGoals_${userId}`);
      const subscriptionsData = loadFromLocalStorage<Subscription[]>(`subscriptions_${userId}`);
      const billsData = loadFromLocalStorage<Bill[]>(`bills_${userId}`);
      const categoriesData = loadFromLocalStorage<Category[]>(`categories_${userId}`);

      if (transactionsData === null) {
        // Data for this user does not exist, initialize it
        const initialData = {
          transactions: isExampleUser ? initialTransactionsData : [],
          budgets: isExampleUser ? initialBudgetsData : [],
          savingsGoals: isExampleUser ? initialSavingsGoalsData : [],
          subscriptions: isExampleUser ? initialSubscriptionsData : [],
          bills: isExampleUser ? initialBillsData : [],
          categories: initialCategories,
        };

        setTransactions(initialData.transactions);
        setBudgets(initialData.budgets);
        setSavingsGoals(initialData.savingsGoals);
        setSubscriptions(initialData.subscriptions);
        setBills(initialData.bills);
        setCategories(initialData.categories);

        // Save this initial state to localStorage
        saveToLocalStorage(`transactions_${userId}`, initialData.transactions);
        saveToLocalStorage(`budgets_${userId}`, initialData.budgets);
        saveToLocalStorage(`savingsGoals_${userId}`, initialData.savingsGoals);
        saveToLocalStorage(`subscriptions_${userId}`, initialData.subscriptions);
        saveToLocalStorage(`bills_${userId}`, initialData.bills);
        saveToLocalStorage(`categories_${userId}`, initialData.categories);

      } else {
        // Data exists, load it from storage
        setTransactions(transactionsData || []);
        setBudgets(budgetsData || []);
        setSavingsGoals(savingsGoalsData || []);
        setSubscriptions(subscriptionsData || []);
        setBills(billsData || []);
        setCategories(categoriesData || initialCategories);
      }
      setIsLoading(false);
    } else {
      // Clear data on logout
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setSubscriptions([]);
      setBills([]);
      setCategories(initialCategories);
    }
  }, [userId, isExampleUser]);

  // Save all data whenever any piece of it changes, but only after initial load is complete
  useEffect(() => {
    if (!isLoading && userId) {
        saveToLocalStorage(`transactions_${userId}`, transactions);
    }
  }, [transactions, userId, isLoading]);

  useEffect(() => {
    if (!isLoading && userId) {
        saveToLocalStorage(`budgets_${userId}`, budgets);
    }
  }, [budgets, userId, isLoading]);

  useEffect(() => {
    if (!isLoading && userId) {
        saveToLocalStorage(`savingsGoals_${userId}`, savingsGoals);
    }
    }, [savingsGoals, userId, isLoading]);

  useEffect(() => {
    if (!isLoading && userId) {
        saveToLocalStorage(`subscriptions_${userId}`, subscriptions);
    }
    }, [subscriptions, userId, isLoading]);

  useEffect(() => {
    if (!isLoading && userId) {
        saveToLocalStorage(`bills_${userId}`, bills);
    }
    }, [bills, userId, isLoading]);

  useEffect(() => {
    if (!isLoading && userId) {
        saveToLocalStorage(`categories_${userId}`, categories);
    }
    }, [categories, userId, isLoading]);


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

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill = { ...bill, id: Date.now().toString() };
    if (bill.installments && bill.installments.total > 1) {
        // Create multiple bills for installments
        const installmentBills: Bill[] = [];
        for (let i = 0; i < bill.installments.total; i++) {
            const dueDate = new Date(bill.dueDate);
            dueDate.setMonth(dueDate.getMonth() + i);
            installmentBills.push({
                ...newBill,
                id: `${newBill.id}-${i}`,
                description: `${bill.description} (${i + 1}/${bill.installments.total})`,
                amount: bill.amount / bill.installments.total,
                dueDate: dueDate,
                installments: { current: i + 1, total: bill.installments.total }
            });
        }
        setBills(prev => [...prev, ...installmentBills].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
    } else {
        setBills(prev => [...prev, newBill].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
    }
  };

  const updateBill = (bill: Bill) => {
    setBills(prev => prev.map(b => b.id === bill.id ? bill : b).sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
    if(bill.status === 'paid' && !transactions.some(t => t.billId === bill.id)) {
        addTransaction({
            description: bill.description,
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
    setTransactions,
    budgets,
    setBudgets,
    savingsGoals,
    setSavingsGoals,
    subscriptions,
    setSubscriptions,
    bills,
    setBills,
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
    addBill,
    updateBill,
    deleteBill,
  };

  if (isLoading) {
    return (
        <DataContext.Provider value={undefined as any}>
            {children}
        </DataContext.Provider>
    )
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
