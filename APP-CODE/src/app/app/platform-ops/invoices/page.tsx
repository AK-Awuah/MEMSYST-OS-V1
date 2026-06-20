"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, DollarSign } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getPlatformOpsService } from "@/lib/services"
import type { Invoice } from "@/types"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getPlatformOpsService()
        const data = await svc.listInvoices()
        if (!cancelled) setInvoices(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleRecordPayment = async (id: string) => {
    setPayingId(id)
    try {
      const svc = await getPlatformOpsService()
      await svc.recordPayment(id, new Date().toISOString(), "manual", `txn-${Date.now()}`)
      setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "paid" as const, paidDate: new Date().toISOString() } : inv))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to record payment")
    } finally {
      setPayingId(null)
    }
  }

  const filtered = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Invoice>[] = [
    { key: "invoiceNumber", header: "Invoice", render: (inv) => <span className="text-white font-mono text-xs">{inv.invoiceNumber}</span> },
    { key: "description", header: "Description", render: (inv) => <span className="text-gray-300 text-sm">{inv.description}</span> },
    { key: "amount", header: "Amount", render: (inv) => <span className="text-gray-400">${inv.amount.toLocaleString()}</span> },
    { key: "dueDate", header: "Due Date", render: (inv) => <span className="text-gray-400 text-xs">{new Date(inv.dueDate).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (inv) => <StatusBadge status={inv.status} /> },
    {
      key: "actions", header: "", render: (inv) => inv.status === "issued" || inv.status === "overdue" ? (
        <button onClick={() => handleRecordPayment(inv.id)} disabled={payingId === inv.id}
          className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors disabled:opacity-50" title="Record payment">
          {payingId === inv.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DollarSign className="h-3.5 w-3.5" />}
        </button>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Billing and invoicing" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No invoices found." />
        </div>
      )}
    </div>
  )
}
