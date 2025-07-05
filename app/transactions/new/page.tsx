import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/components/transaction-form"

export default function NewTransactionPage() {
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
            <h1 className="text-gradient-modern font-bold">New Transaction</h1>
            <p className="responsive-text-lg text-muted-modern">Record a new financial transaction</p>
          </div>
        </div>

        <div className="max-w-2xl xl:max-w-4xl animate-scale-in">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Plus className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="responsive-text-xl font-semibold text-slate-900">Transaction Details</h2>
            </div>
            <p className="responsive-text-sm text-muted-modern">
              Fill in the information below to record your transaction
            </p>
          </div>
          <TransactionForm />
        </div>
      </div>
    </div>
  )
}
