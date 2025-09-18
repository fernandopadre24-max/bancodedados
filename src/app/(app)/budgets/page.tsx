
import { PageHeader } from "@/components/shared/page-header"
import BudgetsClient from "@/components/budgets/budgets-client"

export const metadata = {
  title: "Orçamentos | ContaSimples",
};

export default function BudgetsPage() {
  return (
    <>
      <PageHeader title="Orçamentos" description="Defina e acompanhe suas metas de gastos mensais." />
      <BudgetsClient />
    </>
  )
}
