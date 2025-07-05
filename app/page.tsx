import { Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTransactions, getMonthlyExpenses, getCategoryBreakdown } from "@/lib/transactions"
import RecentTransactions from "@/components/recent-transactions"

// Dynamic imports for charts to prevent SSR issues
const MonthlyExpensesChart = dynamic(() => import("@/components/monthly-chart").then((m) => m.MonthlyExpensesChart), {
  ssr: false,
  loading: () => <div className="h-[250px] sm:h-[300px] loading-shimmer rounded-lg" />,
})

const CategoryPieChart = dynamic(() => import("@/components/category-pie-chart").then((m) => m.CategoryPieChart), {
  ssr: false,
  loading: () => <div className="h-[250px] sm:h-[300px] loading-shimmer rounded-lg" />,
})

export default async function Dashboard() {
  const transactions = await getTransactions()
  const monthlyData = await getMonthlyExpenses()
  const categoryData = await getCategoryBreakdown()

  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const netBalance = totalIncome - totalExpenses
  const transactionCount = transactions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto mobile-safe-padding py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="responsive-flex-header animate-fade-in">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-gradient-modern font-bold">Financial Dashboard</h1>
            <p className="responsive-text-lg text-muted-modern max-w-2xl leading-relaxed">
              Track your financial health with comprehensive analytics and insights
            </p>
          </div>
          <Button asChild size="lg" className="btn-primary-modern w-full sm:w-auto min-h-[48px] px-6 rounded-lg">
            <Link href="/transactions/new">
              <Plus className="h-5 w-5 mr-2" />
              <span className="responsive-text-base font-medium">Add Transaction</span>
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="responsive-grid-stats animate-slide-in-left">
          <Card className="stat-card-modern border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="responsive-text-sm font-medium text-slate-600">Total Income</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="responsive-text-2xl font-bold text-emerald-600">${totalIncome.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card-modern border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="responsive-text-sm font-medium text-slate-600">Total Expenses</CardTitle>
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="responsive-text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3" />
                <span>-3.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card-modern border-l-4 border-l-navy-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="responsive-text-sm font-medium text-slate-600">Net Balance</CardTitle>
              <div className="p-2 bg-navy-50 rounded-lg">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-navy-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`responsive-text-2xl font-bold ${netBalance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                ${Math.abs(netBalance).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>{netBalance >= 0 ? "Surplus" : "Deficit"} this period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card-modern border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="responsive-text-sm font-medium text-slate-600">Transactions</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="responsive-text-2xl font-bold text-blue-600">{transactionCount}</div>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>Total recorded</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="responsive-grid-charts animate-slide-in-right-delayed">
          <Card className="chart-container-modern">
            <CardHeader className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-navy-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-navy-600" />
                </div>
                <div>
                  <CardTitle className="responsive-text-xl text-slate-900">Monthly Trends</CardTitle>
                  <CardDescription className="responsive-text-sm text-muted-modern">
                    Expense patterns over the last 6 months
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <MonthlyExpensesChart data={monthlyData} />
            </CardContent>
          </Card>

          <Card className="chart-container-modern">
            <CardHeader className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="responsive-text-xl text-slate-900">Category Breakdown</CardTitle>
                  <CardDescription className="responsive-text-sm text-muted-modern">
                    Distribution of your expenses
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <CategoryPieChart data={categoryData} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions Section */}
        <Card className="modern-card-elevated animate-scale-in-delayed">
          <CardHeader className="responsive-flex-header space-y-3 sm:space-y-0">
            <div className="space-y-2">
              <CardTitle className="responsive-text-xl text-slate-900">Recent Activity</CardTitle>
              <CardDescription className="responsive-text-sm text-muted-modern">
                Your latest financial transactions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="btn-secondary-modern w-full sm:w-auto min-h-[40px] focus-modern bg-transparent"
            >
              <Link href="/transactions">
                <span className="responsive-text-sm">View All</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 sm:h-20 loading-shimmer rounded-lg" />
                  ))}
                </div>
              }
            >
              <RecentTransactions transactions={transactions.slice(0, 5)} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
