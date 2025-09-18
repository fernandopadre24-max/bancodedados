import { subscriptions } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import SubscriptionsClient from "@/components/subscriptions/subscriptions-client"

export const metadata = {
  title: "Subscriptions | ContaSimples",
};

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Keep track of your recurring payments."
      />
      <SubscriptionsClient initialSubscriptions={subscriptions} />
    </>
  )
}
