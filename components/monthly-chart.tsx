"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MonthlyData {
  month: string
  expenses: number
}

interface MonthlyExpensesChartProps {
  data: MonthlyData[]
}

export function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-slate-500">
        <div className="text-center space-y-3">
          <div className="text-4xl sm:text-6xl">📊</div>
          <p className="responsive-text-sm">No expense data available</p>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="modern-card-elevated p-3 shadow-large border-0">
          <p className="font-medium text-slate-900 responsive-text-sm mb-1">{label}</p>
          <p className="text-red-600 responsive-text-sm font-medium">Expenses: ${payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="expenses"
            fill="url(#expenseGradient)"
            radius={[6, 6, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
