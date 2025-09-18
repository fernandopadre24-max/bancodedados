import { transactions } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import TransactionsClient from "@/components/transactions/transactions-client"

export const metadata = {
  title: "Transactions | ContaSimples",
};

export default function TransactionsPage() {
  return (
    <>
      <TransactionsClient transactions={transactions} />
    </>
  )
}
