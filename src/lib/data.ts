import type { Transaction, Budget, SavingsGoal, Subscription } from './types';

export const transactions: Transaction[] = [
  { id: '1', date: new Date(2024, 6, 1), description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Income' },
  { id: '2', date: new Date(2024, 6, 2), description: 'Rent', amount: 1500, type: 'expense', category: 'Housing' },
  { id: '3', date: new Date(2024, 6, 3), description: 'Groceries', amount: 350, type: 'expense', category: 'Food' },
  { id: '4', date: new Date(2024, 6, 5), description: 'Gasoline', amount: 50, type: 'expense', category: 'Transportation' },
  { id: '5', date: new Date(2024, 6, 7), description: 'Dinner with friends', amount: 80, type: 'expense', category: 'Entertainment' },
  { id: '6', date: new Date(2024, 6, 10), description: 'Electricity Bill', amount: 75, type: 'expense', category: 'Utilities' },
  { id: '7', date: new Date(2024, 6, 12), description: 'New Shoes', amount: 120, type: 'expense', category: 'Shopping' },
  { id: '8', date: new Date(2024, 6, 15), description: 'Freelance Project', amount: 750, type: 'income', category: 'Income' },
  { id: '9', date: new Date(2024, 6, 18), description: 'Pharmacy', amount: 45, type: 'expense', category: 'Health' },
  { id: '10', date: new Date(2024, 6, 22), description: 'Movie Tickets', amount: 30, type: 'expense', category: 'Entertainment' },
  { id: '11', date: new Date(2024, 6, 25), description: 'Weekly Groceries', amount: 150, type: 'expense', category: 'Food' },
  { id: '12', date: new Date(2024, 6, 28), description: 'Internet Bill', amount: 60, type: 'expense', category: 'Utilities' },
];

const spentByCategory = transactions.reduce((acc, t) => {
  if (t.type === 'expense') {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
  }
  return acc;
}, {} as Record<string, number>);


export const budgets: Budget[] = [
  { id: '1', category: 'Food', amount: 600, spent: spentByCategory['Food'] || 0 },
  { id: '2', category: 'Transportation', amount: 200, spent: spentByCategory['Transportation'] || 0 },
  { id: '3', category: 'Housing', amount: 1500, spent: spentByCategory['Housing'] || 0 },
  { id: '4', category: 'Entertainment', amount: 250, spent: spentByCategory['Entertainment'] || 0 },
  { id: '5', category: 'Health', amount: 100, spent: spentByCategory['Health'] || 0 },
  { id: '6', category: 'Shopping', amount: 300, spent: spentByCategory['Shopping'] || 0 },
  { id: '7', category: 'Utilities', amount: 200, spent: spentByCategory['Utilities'] || 0 },
];

export const savingsGoals: SavingsGoal[] = [
  { id: '1', name: 'Vacation to Japan', targetAmount: 5000, currentAmount: 2500 },
  { id: '2', name: 'New Laptop', targetAmount: 2000, currentAmount: 1800 },
  { id: '3', name: 'Down Payment', targetAmount: 20000, currentAmount: 8000 },
];

export const subscriptions: Subscription[] = [
    { id: '1', name: 'Netflix', amount: 15.99, billingCycle: 'monthly', nextPaymentDate: new Date(2024, 7, 10) },
    { id: '2', name: 'Spotify', amount: 10.99, billingCycle: 'monthly', nextPaymentDate: new Date(2024, 7, 15) },
    { id: '3', name: 'Amazon Prime', amount: 139, billingCycle: 'yearly', nextPaymentDate: new Date(2025, 2, 20) },
    { id: '4', name: 'Gym Membership', amount: 40, billingCycle: 'monthly', nextPaymentDate: new Date(2024, 7, 1) },
];
