
import { savingsGoals } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import SavingsClient from "@/components/savings/savings-client"

export const metadata = {
  title: "Metas de Poupança | ContaSimples",
};

export default function SavingsPage() {
  // This component is now only a server-side wrapper.
  // The actual data will be managed by DataContext in SavingsClient.
  return (
    <>
      <PageHeader
        title="Metas de Poupança"
        description="Defina seus objetivos e veja suas economias crescerem."
      />
      <SavingsClient initialGoals={savingsGoals} />
    </>
  )
}
