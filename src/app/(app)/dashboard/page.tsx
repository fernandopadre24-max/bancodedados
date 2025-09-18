import { transactions, budgets, savingsGoals } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import DashboardClient from "@/components/dashboard/dashboard-client"

export const metadata = {
  title: "Painel | ContaSimples",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Bem-vindo de volta!"
        description="Aqui está um resumo da sua saúde financeira."
      />
      <DashboardClient 
        transactions={transactions} 
        budgets={budgets}
        savingsGoals={savingsGoals}
      />
    </>
  )
}
