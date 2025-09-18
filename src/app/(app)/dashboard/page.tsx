import { transactions, budgets, savingsGoals } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import DashboardClient from "@/components/dashboard/dashboard-client"

export const metadata = {
  title: "Dashboard | ContaSimples",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome Back!"
        description="Here's a snapshot of your financial health."
      />
      <DashboardClient 
        transactions={transactions} 
        budgets={budgets}
        savingsGoals={savingsGoals}
      />
    </>
  )
}
