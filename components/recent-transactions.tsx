import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Transaction } from "@/lib/transactions"
import { getCategoryById } from "@/lib/categories"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="text-5xl sm:text-6xl mb-4">💼</div>
        <p className="text-muted-modern mb-6 responsive-text-base">No transactions recorded yet</p>
        <Button size="sm" asChild className="btn-primary-modern w-full sm:w-auto min-h-[44px]">
          <Link href="/transactions/new">
            <span className="responsive-text-sm">Add First Transaction</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {transactions.map((transaction, index) => {
        const category = getCategoryById(transaction.category as any)
        const isIncome = transaction.amount > 0

        return (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-4 sm:p-5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all duration-300 border border-slate-200 hover:border-slate-300 hover:shadow-soft"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0 ${
                  isIncome ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                }`}
              >
                {category?.icon || "📊"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-slate-900 truncate responsive-text-base">{transaction.description}</p>
                  {isIncome ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-modern">
                  <span className="px-2 py-1 rounded-full bg-white border border-slate-200 text-2xs sm:text-xs inline-block w-fit">
                    {category?.name || transaction.category}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
            <div
              className={`font-bold text-lg sm:text-xl flex-shrink-0 ml-3 ${
                isIncome ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isIncome ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RecentTransactions
