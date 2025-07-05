export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { id: "salary", name: "Salary", icon: "💼", color: "#10b981" },
    { id: "freelance", name: "Freelance", icon: "💻", color: "#06b6d4" },
    { id: "investment", name: "Investment", icon: "📈", color: "#8b5cf6" },
    { id: "business", name: "Business", icon: "🏢", color: "#f59e0b" },
    { id: "other-income", name: "Other Income", icon: "💰", color: "#84cc16" },
  ],
  EXPENSE: [
    { id: "food", name: "Food & Dining", icon: "🍽️", color: "#ef4444" },
    { id: "transport", name: "Transportation", icon: "🚗", color: "#f97316" },
    { id: "shopping", name: "Shopping", icon: "🛍️", color: "#ec4899" },
    { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#8b5cf6" },
    { id: "bills", name: "Bills & Utilities", icon: "⚡", color: "#06b6d4" },
    { id: "healthcare", name: "Healthcare", icon: "🏥", color: "#10b981" },
    { id: "education", name: "Education", icon: "📚", color: "#f59e0b" },
    { id: "travel", name: "Travel", icon: "✈️", color: "#84cc16" },
    { id: "other-expense", name: "Other Expenses", icon: "📝", color: "#6b7280" },
  ],
} as const

export type CategoryId =
  | (typeof TRANSACTION_CATEGORIES.INCOME)[number]["id"]
  | (typeof TRANSACTION_CATEGORIES.EXPENSE)[number]["id"]

export function getCategoryById(id: CategoryId) {
  const allCategories = [...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE]
  return allCategories.find((cat) => cat.id === id)
}

export function getCategoriesByType(type: "income" | "expense") {
  return type === "income" ? TRANSACTION_CATEGORIES.INCOME : TRANSACTION_CATEGORIES.EXPENSE
}
