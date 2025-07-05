import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/components/transaction-form"
import { getTransaction } from "@/lib/transactions"

interface EditTransactionPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params
  const transaction = await getTransaction(id)

  if (!transaction) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto mobile-safe-padding py-8 sm:py-12 lg:py-16 space-y-8">
        <div className="flex items-center gap-4 animate-fade-in">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="btn-secondary-modern flex-shrink-0 focus-modern bg-transparent"
          >
            <Link href="/transactions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-gradient-modern font-bold">Edit Transaction</h1>
            <p className="responsive-text-lg text-muted-modern">Update transaction information</p>
          </div>
        </div>

        <div className="max-w-2xl xl:max-w-4xl animate-scale-in">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="responsive-text-xl font-semibold text-slate-900">Transaction Details</h2>
            </div>
            <p className="responsive-text-sm text-muted-modern">Modify the transaction information below</p>
          </div>
          <TransactionForm transaction={transaction} />
        </div>
      </div>
    </div>
  )
}
