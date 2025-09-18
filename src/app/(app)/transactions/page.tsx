
import TransactionsClient from "@/components/transactions/transactions-client"

export const metadata = {
  title: "Transações | ContaSimples",
};

export default function TransactionsPage() {
  // This component is now only a server-side wrapper.
  // The actual data will be managed by DataContext in TransactionsClient.
  return (
    <>
      <TransactionsClient />
    </>
  )
}
