"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Settings } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getCommissionService } from "@/lib/services"
import type { Commission, CommissionConfig } from "@/types"

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [configs, setConfigs] = useState<CommissionConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getCommissionService()
        const [c, cfg] = await Promise.all([svc.listCommissions(), svc.listConfigs()])
        setCommissions(c)
        setConfigs(cfg)
      } catch {
        setError("Failed to load commissions")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: commissions.reduce((s, c) => s + c.amount, 0),
    count: commissions.length,
    activeConfigs: configs.filter((c) => c.status === "active").length,
  }), [commissions, configs])

  const filtered = useMemo(() => {
    if (!search) return commissions
    const s = search.toLowerCase()
    return commissions.filter((c) => c.sourceType.toLowerCase().includes(s))
  }, [commissions, search])

  const columns: Column<Commission>[] = [
    { key: "sourceType", header: "Source", render: (c) => <span className="text-sm capitalize text-white">{c.sourceType.replace("_", " ")}</span> },
    { key: "amount", header: "Amount", render: (c) => <span className="font-mono text-sm text-emerald-400">GHS {c.amount.toLocaleString()}</span> },
    { key: "percentage", header: "Rate", render: (c) => <span className="text-sm">{c.percentage}%</span> },
    { key: "transactionId", header: "Transaction", render: (c) => <span className="text-xs font-mono text-[#3CA4F9]">{c.transactionId.slice(0, 12)}...</span> },
    { key: "createdAt", header: "Date", render: (c) => <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span> },
  ]

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <p>{error}</p>
        <button onClick={() => setError("")} className="mt-2 text-sm underline">Dismiss</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Commissions" description="Track commission earnings across sources" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Commission Earned</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">GHS {stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.count}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Active Configs</p>
          <p className="text-2xl font-bold text-[#3CA4F9] mt-1">{stats.activeConfigs}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#3CA4F9]" /> Commission Configurations
        </h3>
        {configs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No commission configs found.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {configs.map((cfg) => (
              <div key={cfg.id} className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-sm font-medium text-white capitalize">{cfg.sourceType.replace("_", " ")}</p>
                <p className="text-lg font-bold text-[#3CA4F9] mt-1">{cfg.percentage}%</p>
                <p className={`text-xs mt-1 ${cfg.status === "active" ? "text-emerald-400" : "text-gray-500"}`}>{cfg.status === "active" ? "Active" : "Inactive"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search commissions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
