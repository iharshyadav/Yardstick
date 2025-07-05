"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { getCategoryById } from "@/lib/categories"

interface CategoryData {
  category: string
  total: number
  count: number
  type: string
}

interface CategoryPieChartProps {
  data: CategoryData[]
}

const MODERN_COLORS = [
  "#1e40af", // Navy Blue
  "#059669", // Emerald
  "#dc2626", // Red
  "#7c3aed", // Purple
  "#ea580c", // Orange
  "#0891b2", // Cyan
  "#65a30d", // Lime
  "#c2410c", // Orange Red
  "#4338ca", // Indigo
  "#0d9488", // Teal
]

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-slate-500">
        <div className="text-center space-y-3">
          <div className="text-4xl sm:text-6xl">📈</div>
          <p className="responsive-text-sm">No category data available</p>
        </div>
      </div>
    )
  }

  const expenseData = data.filter((item) => item.type === "expense")

  const chartData = expenseData.map((item, index) => {
    const category = getCategoryById(item.category as any)
    return {
      name: category?.name || item.category,
      value: item.total,
      count: item.count,
      color: category?.color || MODERN_COLORS[index % MODERN_COLORS.length],
      icon: category?.icon || "📊",
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="modern-card-elevated p-3 shadow-large border-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{data.icon}</span>
            <span className="font-medium text-slate-900 responsive-text-sm">{data.name}</span>
          </div>
          <p className="responsive-text-sm text-emerald-600 font-medium">Amount: ${data.value.toLocaleString()}</p>
          <p className="responsive-text-sm text-slate-600">Transactions: {data.count}</p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium drop-shadow-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-2xs sm:text-xs text-slate-600 truncate max-w-[100px] sm:max-w-none">
              {entry.payload.icon} {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
