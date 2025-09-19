
import type { LucideIcon } from "lucide-react";

export type Category = string;

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  billId?: string; 
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
  billingCycle: 'mensal' | 'anual';
  nextPaymentDate: Date;
};

export type Bill = {
    id: string;
    description: string;
    amount: number;
    dueDate: Date;
    type: 'payable' | 'receivable';
    status: 'paid' | 'pending';
    installments?: {
        current: number;
        total: number;
    };
    interest?: number; 
}

export type CategoryIconMap = {
  [key in Category]: LucideIcon;
};
