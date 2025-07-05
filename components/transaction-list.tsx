"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Edit, Trash2, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from "@/lib/transactions"
import { deleteTransactionAction } from "@/actions/transactions"
import { getCategoryById } from "@/lib/categories"

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTransactionAction(id)
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })
        router.refresh()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        })
      } finally {
        setDeleteId(null)
      }
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="text-6xl sm:text-8xl mb-6">📊</div>
        <p className="text-muted-modern mb-8 responsive-text-lg">No transactions found</p>
        <Button asChild className="btn-primary-modern w-full sm:w-auto min-h-[48px] px-8">
          <Link href="/transactions/new">
            <span className="responsive-text-base">Add your first transaction</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {transactions.map((transaction, index) => {
          const category = getCategoryById(transaction.category as any)
          const isIncome = transaction.amount > 0

          return (
            <div
              key={transaction._id}
              className="modern-card-hover p-5 sm:p-6 rounded-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                      isIncome ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {category?.icon || "📊"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <div
                        className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${
                          isIncome ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                        {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate responsive-text-base sm:responsive-text-lg">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-muted-modern">
                      <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs inline-block w-fit">
                        {category?.name || transaction.category}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-slate-100 flex-shrink-0 h-10 w-10 focus-modern"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-slate-200 shadow-large">
                    <DropdownMenuItem asChild className="text-slate-900 hover:bg-slate-50 focus:bg-slate-50">
                      <Link href={`/transactions/${transaction._id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        <span className="responsive-text-sm">Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(transaction._id)}
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span className="responsive-text-sm">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-slate-200 shadow-large mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 responsive-text-lg">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-modern responsive-text-base">
              This action cannot be undone. This will permanently delete the transaction from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-0">
            <AlertDialogCancel className="btn-secondary-modern w-full sm:w-auto min-h-[44px]">
              <span className="responsive-text-sm">Cancel</span>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isPending}
              className="btn-danger-modern w-full sm:w-auto min-h-[44px]"
            >
              <span className="responsive-text-sm">Delete Transaction</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
