
import { subscriptions } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import SubscriptionsClient from "@/components/subscriptions/subscriptions-client"

export const metadata = {
  title: "Assinaturas | ContaSimples",
};

export default function SubscriptionsPage() {
  // This component is now only a server-side wrapper.
  // The actual data will be managed by DataContext in SubscriptionsClient.
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
