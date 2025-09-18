
import { PageHeader } from "@/components/shared/page-header"
import ReportsClient from "@/components/reports/reports-client"

export const metadata = {
  title: "Relatórios | ContaSimples",
};

export default function ReportsPage() {
  // This component is now only a server-side wrapper.
  // The actual data will be managed by DataContext in ReportsClient.
  return (
    <>
      <PageHeader
        title="Relatórios Financeiros"
        description="Analise sua saúde financeira ao longo do tempo."
      />
      <ReportsClient />
    </>
  )
}
