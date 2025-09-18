import type { Transaction, Budget, SavingsGoal, Subscription, Bill } from './types';

export const transactions: Transaction[] = [
  { id: '1', date: new Date(2024, 6, 1), description: 'Salário Mensal', amount: 5000, type: 'income', category: 'Renda' },
  { id: '2', date: new Date(2024, 6, 2), description: 'Aluguel', amount: 1500, type: 'expense', category: 'Moradia' },
  { id: '3', date: new Date(2024, 6, 3), description: 'Supermercado', amount: 350, type: 'expense', category: 'Alimentação' },
  { id: '4', date: new Date(2024, 6, 5), description: 'Gasolina', amount: 50, type: 'expense', category: 'Transporte' },
  { id: '5', date: new Date(2024, 6, 7), description: 'Jantar com amigos', amount: 80, type: 'expense', category: 'Entretenimento' },
  { id: '6', date: new Date(2024, 6, 10), description: 'Conta de luz', amount: 75, type: 'expense', category: 'Serviços' },
  { id: '7', date: new Date(2024, 6, 12), description: 'Sapatos novos', amount: 120, type: 'expense', category: 'Compras' },
  { id: '8', date: new Date(2024, 6, 15), description: 'Projeto Freelance', amount: 750, type: 'income', category: 'Renda' },
  { id: '9', date: new Date(2024, 6, 18), description: 'Farmácia', amount: 45, type: 'expense', category: 'Saúde' },
  { id: '10', date: new Date(2024, 6, 22), description: 'Ingressos de cinema', amount: 30, type: 'expense', category: 'Entretenimento' },
  { id: '11', date: new Date(2024, 6, 25), description: 'Compras da semana', amount: 150, type: 'expense', category: 'Alimentação' },
  { id: '12', date: new Date(2024, 6, 28), description: 'Conta de internet', amount: 60, type: 'expense', category: 'Serviços' },
];

const spentByCategory = transactions.reduce((acc, t) => {
  if (t.type === 'expense') {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
  }
  return acc;
}, {} as Record<string, number>);


export const budgets: Budget[] = [
  { id: '1', category: 'Alimentação', amount: 600, spent: spentByCategory['Alimentação'] || 0 },
  { id: '2', category: 'Transporte', amount: 200, spent: spentByCategory['Transporte'] || 0 },
  { id: '3', category: 'Moradia', amount: 1500, spent: spentByCategory['Moradia'] || 0 },
  { id: '4', category: 'Entretenimento', amount: 250, spent: spentByCategory['Entretenimento'] || 0 },
  { id: '5', category: 'Saúde', amount: 100, spent: spentByCategory['Saúde'] || 0 },
  { id: '6', category: 'Compras', amount: 300, spent: spentByCategory['Compras'] || 0 },
  { id: '7', category: 'Serviços', amount: 200, spent: spentByCategory['Serviços'] || 0 },
];

export const savingsGoals: SavingsGoal[] = [
  { id: '1', name: 'Viagem para o Japão', targetAmount: 5000, currentAmount: 2500 },
  { id: '2', name: 'Novo Laptop', targetAmount: 2000, currentAmount: 1800 },
  { id: '3', name: 'Entrada do Apartamento', targetAmount: 20000, currentAmount: 8000 },
];

export const subscriptions: Subscription[] = [
    { id: '1', name: 'Netflix', amount: 15.99, billingCycle: 'mensal', nextPaymentDate: new Date(2024, 7, 10) },
    { id: '2', name: 'Spotify', amount: 10.99, billingCycle: 'mensal', nextPaymentDate: new Date(2024, 7, 15) },
    { id: '3', name: 'Amazon Prime', amount: 139, billingCycle: 'anual', nextPaymentDate: new Date(2025, 2, 20) },
    { id: '4', name: 'Academia', amount: 40, billingCycle: 'mensal', nextPaymentDate: new Date(2024, 7, 1) },
];

export const bills: Bill[] = [
    { id: '1', description: 'Plano de Saúde', amount: 300, dueDate: new Date(2024, 7, 5), type: 'payable', status: 'pending' },
    { id: '2', description: 'Consultoria de Design', amount: 1200, dueDate: new Date(2024, 7, 20), type: 'receivable', status: 'pending' },
    { id: '3', description: 'Compra de Notebook (Parcela 1/12)', amount: 250, dueDate: new Date(2024, 7, 15), type: 'payable', status: 'pending', installments: { current: 1, total: 12 } },
    { id: '4', description: 'Fatura do Cartão de Crédito', amount: 850, dueDate: new Date(2024, 7, 8), type: 'payable', status: 'pending' },
]
