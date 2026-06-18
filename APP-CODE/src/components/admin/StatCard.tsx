import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
  subtitle?: string
}

export function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 p-5 backdrop-blur-md transition-all hover:border-[#3CA4F9]/40 hover:shadow-[0_0_20px_rgba(60,164,249,0.15)] group"
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#3CA4F9]/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold ${trend.positive ? "text-emerald-400" : "text-rose-400"}`}>
              {trend.value}
            </p>
          )}
          {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#012a42] text-[#3CA4F9] shadow-inner border border-white/5 transition-colors group-hover:bg-[#3CA4F9]/10">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}
