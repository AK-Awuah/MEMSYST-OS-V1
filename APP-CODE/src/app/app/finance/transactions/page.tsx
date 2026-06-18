"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, ArrowUpRight } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getLedgerService } from "@/lib/services"
import { TRANSACTION_TYPE_LABELS, TRANSACTION_STATUSES, TRANSACTION_STATUS_LABELS, TRANSACTION_TYPES } from "@/lib/constants"
import type { LedgerEntry } from "@/types"

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  successful: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  refunded: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

export default function TransactionsPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getLedgerService()
        const data = await svc.listEntries({ limit: 100 })
        setEntries(data)
      } catch {
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return entries
    const s = search.toLowerCase()
    return entries.filter((e) => e.referenceNumber.toLowerCase().includes(s) || e.description.toLowerCase().includes(s))
  }, [entries, search])

  const columns: Column<LedgerEntry>[] = [
    { key: "referenceNumber", header: "Reference", render: (e) => <span className="font-mono text-xs text-[#3CA4F9]">{e.referenceNumber}</span> },
    { key: "description", header: "Description", render: (e) => <span className="text-sm text-white">{e.description}</span> },
    { key: "amount", header: "Amount", render: (e) => <span className="font-mono text-sm font-medium">GHS {e.amount.toLocaleString()}</span> },
    { key: "debitWalletId", header: "Source", render: (e) => <span className="text-xs text-gray-400">{e.debitWalletId.slice(0, 12)}...</span> },
    { key: "creditWalletId", header: "Destination", render: (e) => <span className="text-xs text-gray-400">{e.creditWalletId.slice(0, 12)}...</span> },
    { key: "createdAt", header: "Date", render: (e) => <span className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</span> },
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
      <PageHeader title="Transactions" description="Ledger entries across all wallets" />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search by reference or description..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
