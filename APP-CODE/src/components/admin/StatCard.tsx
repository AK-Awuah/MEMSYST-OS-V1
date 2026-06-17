import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
  subtitle?: string
}

export function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-5 transition-colors hover:border-[#3CA4F9]/30">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs ${trend.positive ? "text-green-400" : "text-red-400"}`}>
              {trend.value}
            </p>
          )}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {icon && <div className="text-[#3CA4F9]/60">{icon}</div>}
      </div>
    </div>
  )
}
