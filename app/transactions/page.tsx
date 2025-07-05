import { Suspense } from "react"
import Link from "next/link"
import { Plus, ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/transaction-list"
import { getTransactions } from "@/lib/transactions"

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto mobile-safe-padding py-8 sm:py-12 lg:py-16 space-y-8">
        <div className="responsive-flex-header animate-fade-in">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="btn-secondary-modern flex-shrink-0 focus-modern bg-transparent"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-gradient-modern font-bold">Transaction History</h1>
              <p className="responsive-text-lg text-muted-modern">Complete record of your financial activity</p>
            </div>
          </div>
          <Button asChild size="lg" className="btn-primary-modern w-full sm:w-auto min-h-[48px] px-6 focus-modern">
            <Link href="/transactions/new">
              <Plus className="h-5 w-5 mr-2" />
              <span className="responsive-text-base">New Transaction</span>
            </Link>
          </Button>
        </div>

        <Card className="modern-card-elevated animate-scale-in">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-navy-50 rounded-lg">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-navy-600" />
              </div>
              <div>
                <CardTitle className="responsive-text-xl text-slate-900">All Transactions</CardTitle>
                <p className="responsive-text-sm text-muted-modern">
                  {transactions.length} total transactions recorded
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-20 sm:h-24 loading-shimmer rounded-lg" />
                  ))}
                </div>
              }
            >
              <TransactionList transactions={transactions} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
