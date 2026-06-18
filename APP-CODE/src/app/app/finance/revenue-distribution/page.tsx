"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Percent } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getRevenueDistributionService } from "@/lib/services"
import type { RevenueDistributionRule } from "@/types"

export default function RevenueDistributionPage() {
  const [rules, setRules] = useState<RevenueDistributionRule[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getRevenueDistributionService()
        const data = await svc.listRules("tenant-1")
        setRules(data)
      } catch {
        setError("Failed to load revenue rules")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return rules
    const s = search.toLowerCase()
    return rules.filter((r) => r.name.toLowerCase().includes(s) || r.sourceType.toLowerCase().includes(s))
  }, [rules, search])

  const columns: Column<RevenueDistributionRule>[] = [
    { key: "name", header: "Rule Name", render: (r) => <span className="text-sm font-medium text-white">{r.name}</span> },
    { key: "sourceType", header: "Source Type", render: (r) => <span className="text-sm capitalize">{r.sourceType.replace("_", " ")}</span> },
    {
      key: "rules", header: "Distribution Splits", render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.rules.map((split, i) => (
            <span key={i} className="inline-block rounded-full bg-[#1e3a5f] px-2 py-0.5 text-xs text-gray-300">
              {split.destinationWalletType}: {split.percentage}%
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status", header: "Status", render: (r) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${r.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
          {r.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "effectiveDate", header: "Effective", render: (r) => <span className="text-xs text-gray-500">{new Date(r.effectiveDate).toLocaleDateString()}</span> },
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
      <PageHeader title="Revenue Distribution" description="Configure how revenue is split across wallets" />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search rules..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
