"use server"

import { revalidatePath } from "next/cache"
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/transactions"


export async function createTransactionAction(data: {
  amount: number
  description: string
  date: Date
  category: string
}) {
  try {
    // console.log("Creating transaction:", data)
    await createTransaction(data)
    revalidatePath("/")
    revalidatePath("/transactions")
    // console.log("Transaction created successfully")
  } catch (error) {
    console.error("Failed to create transaction:", error)
    throw new Error("Failed to create transaction")
  }
}

export async function updateTransactionAction(
  id: string,
  data: {
    amount: number
    description: string
    date: Date
    category: string
  },
) {
  try {
    // console.log("Updating transaction:", id, data)
    await updateTransaction(id, data)
    revalidatePath("/")
    revalidatePath("/transactions")
    // console.log("Transaction updated successfully")
  } catch (error) {
    console.error("Failed to update transaction:", error)
    throw new Error("Failed to update transaction")
  }
}

export async function deleteTransactionAction(id: string) {
  try {
    // console.log("Deleting transaction:", id)
    await deleteTransaction(id)
    revalidatePath("/")
    revalidatePath("/transactions")
    // console.log("Transaction deleted successfully")
  } catch (error) {
    console.error("Failed to delete transaction:", error)
    throw new Error("Failed to delete transaction")
  }
}
