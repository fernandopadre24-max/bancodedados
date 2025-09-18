import { budgets, transactions } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import BudgetsClient from "@/components/budgets/budgets-client"

export const metadata = {
  title: "Budgets | ContaSimples",
};

export default function BudgetsPage() {
  const historicalSpending = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
        const categoryKey = t.category.toLowerCase().replace(' ', '');
        acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <PageHeader title="Budgets" description="Set and track your monthly spending goals." />
      <BudgetsClient 
        initialBudgets={budgets}
        historicalSpendingData={historicalSpending}
        income={income}
      />
    </>
  )
}
