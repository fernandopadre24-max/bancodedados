import type { LucideIcon } from "lucide-react";

export type Category = 'Food' | 'Transportation' | 'Housing' | 'Entertainment' | 'Health' | 'Shopping' | 'Utilities' | 'Income';

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
};

export type Budget = {
  id: string;
  category: Category;
  amount: number;
  spent: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextPaymentDate: Date;
};

export type CategoryIconMap = {
  [key in Category]: LucideIcon;
};
