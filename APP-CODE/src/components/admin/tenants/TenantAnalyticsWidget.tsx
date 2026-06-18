"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getTenantManagementService } from "@/lib/services"
import type { TenantAnalytics } from "@/types"
import { Building2, CheckCircle, MapPin, GitBranch, Users, TrendingUp } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function TenantAnalyticsWidget() {
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantManagementService().then((svc) =>
      svc.getAnalytics().then((data) => {
        setAnalytics(data)
        setLoading(false)
      })
    )
  }, [])

  if (loading || !analytics) {
    return (
      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-[#1e3a5f]" />
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 rounded-xl bg-[#1e3a5f]" />)}
          </div>
          <div className="h-40 rounded-xl bg-[#1e3a5f]" />
        </div>
      </div>
    )
  }

  const cards = [
    { label: "Total Tenants", value: analytics.totalTenants, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Active", value: analytics.activeTenants, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Regions", value: analytics.totalRegions, icon: MapPin, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Branches", value: analytics.totalBranches, icon: GitBranch, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Executives", value: analytics.totalExecutives, icon: Users, color: "text-pink-400", bg: "bg-pink-500/10" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#3CA4F9]" /> Tenant Analytics
          </h3>
          <p className="text-sm text-gray-400 mt-1">Platform-wide organization metrics</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-5 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-3 text-center">
            <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="text-lg font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="h-[200px]">
        <p className="mb-3 text-sm text-gray-400 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-[#3CA4F9]" /> Growth Trends
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics.growthTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3CA4F9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3CA4F9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#012a42', borderColor: '#1e3a5f', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="count" stroke="#3CA4F9" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
