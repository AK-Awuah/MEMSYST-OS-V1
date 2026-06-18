"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getWithdrawalService } from "@/lib/services"
import { WITHDRAWAL_STATUS_LABELS, WITHDRAWAL_STATUSES } from "@/lib/constants"
import type { Withdrawal } from "@/types"

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  under_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  platform_review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  processing: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getWithdrawalService()
        const data = await svc.listWithdrawals()
        setWithdrawals(data)
      } catch {
        setError("Failed to load withdrawals")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: withdrawals.length,
    pending: withdrawals.filter((w) => ["submitted", "under_review", "platform_review"].includes(w.status)).length,
    completed: withdrawals.filter((w) => w.status === "completed").length,
    totalAmount: withdrawals.reduce((s, w) => s + w.amount, 0),
  }), [withdrawals])

  const filtered = useMemo(() => {
    let result = withdrawals
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((w) => w.ownerName.toLowerCase().includes(s) || w.reason.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") result = result.filter((w) => w.status === statusFilter)
    return result
  }, [withdrawals, search, statusFilter])

  const columns: Column<Withdrawal>[] = [
    { key: "ownerName", header: "Requestor", render: (w) => <span className="text-sm font-medium text-white">{w.ownerName}</span> },
    { key: "amount", header: "Amount", render: (w) => <span className="font-mono text-sm">GHS {w.amount.toLocaleString()}</span> },
    { key: "fee", header: "Fee", render: (w) => <span className="font-mono text-sm text-amber-400">GHS {w.fee.toLocaleString()}</span> },
    { key: "netAmount", header: "Net", render: (w) => <span className="font-mono text-sm text-emerald-400">GHS {w.netAmount.toLocaleString()}</span> },
    { key: "payoutMethod", header: "Method", render: (w) => <span className="text-xs capitalize">{w.payoutMethod.replace("_", " ")}</span> },
    {
      key: "status", header: "Status", render: (w) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[w.status] || ""}`}>
          {WITHDRAWAL_STATUS_LABELS[w.status]}
        </span>
      ),
    },
    { key: "createdAt", header: "Date", render: (w) => <span className="text-xs text-gray-500">{new Date(w.createdAt).toLocaleDateString()}</span> },
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
      <PageHeader title="Withdrawals" description="Review and manage withdrawal requests" />

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
          <p className="text-xs text-gray-500">Total Requested</p>
          <p className="text-2xl font-bold text-white mt-1">GHS {stats.totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search withdrawals..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {WITHDRAWAL_STATUSES.map((s) => <option key={s} value={s}>{WITHDRAWAL_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
