
import { PageHeader } from "@/components/shared/page-header"
import DashboardClient from "@/components/dashboard/dashboard-client"

export const metadata = {
  title: "Painel | ContaSimples",
};

export default function DashboardPage() {
  // This component is now only a server-side wrapper.
  // The actual data will be managed by DataContext in DashboardClient.
  return (
    <>
      <PageHeader
        title="Bem-vindo de volta!"
        description="Aqui está um resumo da sua saúde financeira."
      />
      <DashboardClient />
    </>
  )
}
