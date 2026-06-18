"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, Receipt } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getBillingService } from "@/lib/services"
import { BILL_STATUS_LABELS, BILL_STATUSES, BILL_TYPES, BILL_TYPE_LABELS } from "@/lib/constants"
import type { Bill } from "@/types"

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  due: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  partially_paid: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getBillingService()
        const data = await svc.listBills()
        setBills(data)
      } catch {
        setError("Failed to load bills")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: bills.length,
    paid: bills.filter((b) => b.status === "paid").length,
    overdue: bills.filter((b) => b.status === "overdue").length,
    outstanding: bills.reduce((s, b) => s + (b.amount - b.paidAmount), 0),
  }), [bills])

  const filtered = useMemo(() => {
    let result = bills
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((b) => b.description.toLowerCase().includes(s) || b.memberId.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter)
    return result
  }, [bills, search, statusFilter])

  const columns: Column<Bill>[] = [
    { key: "description", header: "Description", render: (b) => <span className="text-sm text-white font-medium">{b.description}</span> },
    { key: "type", header: "Type", render: (b) => <span className="text-sm">{BILL_TYPE_LABELS[b.type]}</span> },
    { key: "amount", header: "Amount", render: (b) => <span className="font-mono text-sm">GHS {b.amount.toLocaleString()}</span> },
    { key: "paidAmount", header: "Paid", render: (b) => <span className="font-mono text-sm text-emerald-400">GHS {b.paidAmount.toLocaleString()}</span> },
    { key: "dueDate", header: "Due Date", render: (b) => <span className="text-xs text-gray-400">{new Date(b.dueDate).toLocaleDateString()}</span> },
    {
      key: "status", header: "Status", render: (b) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[b.status] || ""}`}>
          {BILL_STATUS_LABELS[b.status]}
        </span>
      ),
    },
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
      <PageHeader title="Billing" description="Manage bills and invoices" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Bills</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.paid}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{stats.overdue}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">GHS {stats.outstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search bills..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {BILL_STATUSES.map((s) => <option key={s} value={s}>{BILL_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
