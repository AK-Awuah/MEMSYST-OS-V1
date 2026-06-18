"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { StatCardSkeleton, TableSkeleton } from "@/components/admin/Skeleton"
import { getFinancialDashboardService, getWalletService, getWithdrawalService } from "@/lib/services"
import type { FinancialDashboardMetrics, Wallet, Withdrawal } from "@/types"
import { Wallet as WalletIcon, TrendingUp, CreditCard, Lock, ArrowUpRight, Clock, Receipt, Users, BarChart3 } from "lucide-react"

const chartData = [
  { month: "Jan", revenue: 12500, commissions: 1850 },
  { month: "Feb", revenue: 15200, commissions: 2100 },
  { month: "Mar", revenue: 18400, commissions: 2450 },
  { month: "Apr", revenue: 16200, commissions: 2200 },
  { month: "May", revenue: 21800, commissions: 3100 },
  { month: "Jun", revenue: 24500, commissions: 3600 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function FinanceDashboardPage() {
  const [metrics, setMetrics] = useState<FinancialDashboardMetrics | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [dashboardSvc, walletSvc, withdrawalSvc] = await Promise.all([
        getFinancialDashboardService(), getWalletService(), getWithdrawalService(),
      ])
      const [m, w, wd] = await Promise.all([
        dashboardSvc.getPlatformMetrics(),
        walletSvc.listWallets({ status: "active" }),
        withdrawalSvc.listWithdrawals({ status: "submitted" }),
      ])
      setMetrics(m)
      setWallets(w)
      setPendingWithdrawals(wd)
      setLoading(false)
    }
    load()
  }, [])

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6 pb-12">
        <PageHeader title="Finance Dashboard" description="Loading..." />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={4} cols={4} />
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader title="Finance Dashboard" description="Real-time financial intelligence for the platform." />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`GHS ${metrics.totalRevenue.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} trend={{ value: "+18.2%", positive: true }} />
        <StatCard title="Total Commissions" value={`GHS ${metrics.totalCommissions.toLocaleString()}`} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Active Wallets" value={metrics.activeWallets} icon={<WalletIcon className="h-5 w-5" />} subtitle={`${wallets.length} total active`} />
        <StatCard title="Outstanding Bills" value={`GHS ${metrics.outstandingBills.toLocaleString()}`} icon={<Receipt className="h-5 w-5" />} trend={{ value: "+5.8%", positive: false }} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2 overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 relative">
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#3CA4F9]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3CA4F9]" /> Revenue & Commission Trends
              </h3>
              <p className="text-sm text-gray-400 mt-1">Monthly financial performance overview</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3CA4F9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3CA4F9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#012a42', borderColor: '#1e3a5f', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3CA4F9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="commissions" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCommissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-amber-400" /> Fund Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Total Wallet Units</span>
                <span className="text-sm font-bold text-white">GHS {metrics.totalWalletUnits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Locked Funds</span>
                <span className="text-sm font-bold text-amber-400">GHS {metrics.totalLockedFunds.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Total Collections</span>
                <span className="text-sm font-bold text-emerald-400">GHS {metrics.totalCollections.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Pending Withdrawals</span>
                <span className="text-sm font-bold text-[#3CA4F9]">{metrics.pendingWithdrawals}</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#3CA4F9]" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: "Review Withdrawal Requests", count: pendingWithdrawals.length, href: "/app/finance/withdrawals" },
                { label: "Manage Revenue Rules", href: "/app/finance/revenue-distribution" },
                { label: "View Recent Transactions", href: "/app/finance/transactions" },
              ].map((action) => (
                <a key={action.label} href={action.href} className="flex items-center justify-between p-3 rounded-xl bg-[#012a42]/30 border border-[#1e3a5f] hover:bg-[#012a42]/60 transition-colors group">
                  <span className="text-sm text-gray-300 group-hover:text-white">{action.label}</span>
                  <div className="flex items-center gap-2">
                    {action.count !== undefined && action.count > 0 && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{action.count}</span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#3CA4F9]" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <WalletIcon className="w-5 h-5 text-[#3CA4F9]" /> Active Wallets
          </h3>
          {wallets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No active wallets found.</p>
          ) : (
            <div className="space-y-3">
              {wallets.slice(0, 5).map((wal) => (
                  <a key={wal.id} href={`/app/finance/wallets/${wal.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[#012a42]/30 border border-[#1e3a5f] hover:bg-[#012a42]/60 transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-white capitalize">{wal.type}: {wal.ownerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">GHS {wal.balance.toLocaleString()} · {wal.currency}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#3CA4F9]" />
                </a>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-400" /> Platform Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Transaction Volume", value: metrics.transactionVolume },
              { label: "Active Wallets", value: metrics.activeWallets },
              { label: "Pending Withdrawals", value: metrics.pendingWithdrawals },
              { label: "Outstanding Bills", value: `GHS ${metrics.outstandingBills.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f] text-center">
                <p className="text-2xl font-bold text-white">{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</p>
                <p className="text-xs text-gray-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
