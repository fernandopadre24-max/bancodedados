
import { budgets, transactions } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import BudgetsClient from "@/components/budgets/budgets-client"
import { useData } from "@/context/DataContext"

export const metadata = {
  title: "Orçamentos | ContaSimples",
};

export default function BudgetsPage() {
  const { transactions } = useData();
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
      <PageHeader title="Orçamentos" description="Defina e acompanhe suas metas de gastos mensais." />
      <BudgetsClient 
        initialBudgets={budgets}
        historicalSpendingData={historicalSpending}
        income={income}
      />
    </>
  )
}
