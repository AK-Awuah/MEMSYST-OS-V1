"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, CheckCircle, XCircle } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getRefundService } from "@/lib/services"
import { REFUND_STATUS_LABELS, REFUND_STATUSES } from "@/lib/constants"
import type { Refund } from "@/types"

const statusColors: Record<string, string> = {
  requested: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  under_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getRefundService()
        const data = await svc.listRefunds()
        setRefunds(data)
      } catch {
        setError("Failed to load refunds")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: refunds.length,
    pending: refunds.filter((r) => r.status === "requested" || r.status === "under_review").length,
    completed: refunds.filter((r) => r.status === "completed").length,
    totalAmount: refunds.reduce((s, r) => s + r.amount, 0),
  }), [refunds])

  const filtered = useMemo(() => {
    let result = refunds
    if (search) result = result.filter((r) => r.reason.toLowerCase().includes(search.toLowerCase()))
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter)
    return result
  }, [refunds, search, statusFilter])

  const columns: Column<Refund>[] = [
    { key: "transactionId", header: "Transaction", render: (r) => <span className="font-mono text-xs text-[#3CA4F9]">{r.transactionId.slice(0, 12)}...</span> },
    { key: "amount", header: "Amount", render: (r) => <span className="font-mono text-sm">GHS {r.amount.toLocaleString()}</span> },
    { key: "reason", header: "Reason", render: (r) => <span className="text-sm text-white">{r.reason}</span> },
    {
      key: "status", header: "Status", render: (r) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status] || ""}`}>
          {REFUND_STATUS_LABELS[r.status]}
        </span>
      ),
    },
    { key: "createdAt", header: "Date", render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
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
      <PageHeader title="Refunds" description="Manage refund requests" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Refunded</p>
          <p className="text-2xl font-bold text-white mt-1">GHS {stats.totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search refunds..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {REFUND_STATUSES.map((s) => <option key={s} value={s}>{REFUND_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
