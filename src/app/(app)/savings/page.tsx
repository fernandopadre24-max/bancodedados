import { savingsGoals } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import SavingsClient from "@/components/savings/savings-client"

export const metadata = {
  title: "Savings Goals | ContaSimples",
};

export default function SavingsPage() {
  return (
    <>
      <PageHeader
        title="Savings Goals"
        description="Define your goals and watch your savings grow."
      />
      <SavingsClient initialGoals={savingsGoals} />
    </>
  )
}
