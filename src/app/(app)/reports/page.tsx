import { transactions, budgets } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import ReportsClient from "@/components/reports/reports-client"

export const metadata = {
  title: "Relatórios | ContaSimples",
};

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Relatórios Financeiros"
        description="Analise sua saúde financeira ao longo do tempo."
      />
      <ReportsClient transactions={transactions} budgets={budgets} />
    </>
  )
}
