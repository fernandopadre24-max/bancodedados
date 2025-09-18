
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Transaction, Budget, SavingsGoal, Subscription, Category, Bill } from '@/lib/types';
import { 
    transactions as initialTransactions, 
    budgets as initialBudgets, 
    savingsGoals as initialSavingsGoals,
    subscriptions as initialSubscriptions,
    bills as initialBills
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [bills, setBills] = useState(initialBills);
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
    if(bill.status === 'paid') {
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
