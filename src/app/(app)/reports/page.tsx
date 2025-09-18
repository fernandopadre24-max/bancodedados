import { transactions, budgets } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import ReportsClient from "@/components/reports/reports-client"

export const metadata = {
  title: "Reports | ContaSimples",
};

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Financial Reports"
        description="Analyze your financial health over time."
      />
      <ReportsClient transactions={transactions} budgets={budgets} />
    </>
  )
}
