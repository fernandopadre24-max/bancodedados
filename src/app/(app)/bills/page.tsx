
import { PageHeader } from "@/components/shared/page-header"
import BillsClient from "@/components/bills/bills-client"

export const metadata = {
  title: "Contas | ContaSimples",
};

export default function BillsPage() {
  return (
    <>
      <PageHeader
        title="Contas a Pagar e Receber"
        description="Gerencie seus compromissos financeiros."
      />
      <BillsClient />
    </>
  )
}
