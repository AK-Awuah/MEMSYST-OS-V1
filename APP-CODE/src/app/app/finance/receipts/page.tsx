"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, FileText, Download } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import type { Receipt } from "@/types"
import { delay } from "@/lib/services/shared-store"

const mockReceipts: Receipt[] = [
  { id: "rct-1", tenantId: "tenant-1", transactionId: "txn-001", receiptNumber: "RCP-2026-0001", amount: 500, payerName: "John Doe", paymentMethod: "mobile_money", status: "generated", createdAt: "2026-06-01T10:30:00Z" },
  { id: "rct-2", tenantId: "tenant-1", transactionId: "txn-002", receiptNumber: "RCP-2026-0002", amount: 1200, payerName: "Jane Smith", paymentMethod: "card", status: "sent", createdAt: "2026-06-05T14:20:00Z" },
  { id: "rct-3", tenantId: "tenant-1", transactionId: "txn-003", receiptNumber: "RCP-2026-0003", amount: 350, payerName: "Acme Corp", paymentMethod: "bank_transfer", status: "verified", createdAt: "2026-06-10T09:15:00Z" },
  { id: "rct-4", tenantId: "tenant-1", transactionId: "txn-004", receiptNumber: "RCP-2026-0004", amount: 800, payerName: "Bob Johnson", paymentMethod: "mobile_money", status: "generated", createdAt: "2026-06-12T16:45:00Z" },
  { id: "rct-5", tenantId: "tenant-1", transactionId: "txn-005", receiptNumber: "RCP-2026-0005", amount: 2000, payerName: "Global Services Ltd", paymentMethod: "bank_transfer", status: "sent", createdAt: "2026-06-15T11:00:00Z" },
]

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        await delay(100)
        setReceipts(mockReceipts)
      } catch {
        setError("Failed to load receipts")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return receipts
    const s = search.toLowerCase()
    return receipts.filter((r) => r.receiptNumber.toLowerCase().includes(s) || r.payerName.toLowerCase().includes(s))
  }, [receipts, search])

  const columns: Column<Receipt>[] = [
    { key: "receiptNumber", header: "Receipt #", render: (r) => <span className="font-mono text-sm text-[#3CA4F9]">{r.receiptNumber}</span> },
    { key: "payerName", header: "Payer", render: (r) => <span className="text-sm font-medium text-white">{r.payerName}</span> },
    { key: "amount", header: "Amount", render: (r) => <span className="font-mono text-sm">GHS {r.amount.toLocaleString()}</span> },
    { key: "paymentMethod", header: "Method", render: (r) => <span className="text-xs capitalize">{r.paymentMethod.replace("_", " ")}</span> },
    {
      key: "status", header: "Status", render: (r) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${r.status === "verified" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : r.status === "sent" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
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
      <PageHeader title="Receipts" description="View and manage payment receipts" />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search receipts..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} />
    </div>
  )
}
