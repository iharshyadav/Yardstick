"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from "@/lib/transactions"
import { createTransactionAction, updateTransactionAction } from "@/actions/transactions"
import { getCategoriesByType } from "@/lib/categories"

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) !== 0, "Amount must be a valid non-zero number"),
  description: z.string().min(1, "Description is required").max(200, "Description too long"),
  date: z.date({
    required_error: "Date is required",
  }),
  type: z.enum(["income", "expense"], {
    required_error: "Please select a transaction type",
  }),
  category: z.string().min(1, "Please select a category"),
})

interface TransactionFormProps {
  transaction?: Transaction
}

export function TransactionForm({ transaction }: TransactionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction ? Math.abs(transaction.amount).toString() : "",
      description: transaction?.description || "",
      date: transaction ? new Date(transaction.date) : new Date(),
      type: transaction ? (transaction.amount > 0 ? "income" : "expense") : "expense",
      category: transaction?.category || "",
    },
  })

  const watchedType = form.watch("type")

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const amount = values.type === "income" ? Math.abs(Number(values.amount)) : -Math.abs(Number(values.amount))

        const transactionData = {
          amount,
          description: values.description,
          date: values.date,
          category: values.category,
        }

        if (transaction) {
          await updateTransactionAction(transaction._id, transactionData)
          toast({
            title: "Success",
            description: "Transaction updated successfully",
          })
        } else {
          await createTransactionAction(transactionData)
          toast({
            title: "Success",
            description: "Transaction created successfully",
          })
        }

        router.push("/transactions")
        router.refresh()
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const availableCategories = getCategoriesByType(watchedType || "expense")

  return (
    <div className="modern-card-elevated p-6 sm:p-8 lg:p-10 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 responsive-text-base font-medium">Transaction Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue("category", "") // Reset category when type changes
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="input-modern h-12 responsive-text-base focus-modern">
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-200 shadow-large">
                      <SelectItem value="income" className="text-emerald-600 hover:bg-emerald-50">
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span>Income</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="expense" className="text-red-600 hover:bg-red-50">
                        <div className="flex items-center gap-2">
                          <span>💸</span>
                          <span>Expense</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 responsive-text-base font-medium">Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      className="input-modern h-12 responsive-text-base focus-modern"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-900 responsive-text-base font-medium">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-modern h-12 responsive-text-base focus-modern">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border-slate-200 shadow-large max-h-60">
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-slate-900 hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="responsive-text-sm">{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-900 responsive-text-base font-medium">Transaction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "input-modern h-12 pl-3 text-left font-normal responsive-text-base focus-modern",
                          !field.value && "text-slate-500",
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-slate-200 shadow-large" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="text-slate-900"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-900 responsive-text-base font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter transaction description..."
                    className="resize-none input-modern min-h-[120px] responsive-text-base focus-modern"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="btn-primary-modern w-full sm:w-auto min-h-[48px] px-8 focus-modern"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <span className="responsive-text-base font-medium">{transaction ? "Update" : "Create"} Transaction</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="btn-secondary-modern w-full sm:w-auto min-h-[48px] px-8 focus-modern"
            >
              <span className="responsive-text-base">Cancel</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
