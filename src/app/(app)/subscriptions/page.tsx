import { subscriptions } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import SubscriptionsClient from "@/components/subscriptions/subscriptions-client"

export const metadata = {
  title: "Assinaturas | ContaSimples",
};

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Assinaturas"
        description="Acompanhe seus pagamentos recorrentes."
      />
      <SubscriptionsClient initialSubscriptions={subscriptions} />
    </>
  )
}
