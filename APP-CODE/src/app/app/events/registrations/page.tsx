"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { REGISTRATION_STATUS_LABELS } from "@/lib/constants"
import { getEventsService } from "@/lib/services"
import type { EventRegistration } from "@/types"

export default function RegistrationsListPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        const svc = await getEventsService()
        const data = await svc.listRegistrations("all", "tenant-1")
        if (!cancelled) setRegistrations(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleConfirm = async (id: string) => {
    setActingId(id)
    try {
      const svc = await getEventsService()
      await svc.confirmRegistration(id)
      setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status: "confirmed" as const } : r))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to confirm registration")
    } finally {
      setActingId(null)
    }
  }

  const handleCancel = async (id: string) => {
    setActingId(id)
    try {
      const svc = await getEventsService()
      await svc.cancelRegistration(id)
      setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status: "cancelled" as const } : r))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to cancel registration")
    } finally {
      setActingId(null)
    }
  }

  const filtered = registrations.filter((r) => {
    const matchesSearch = r.memberName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: Column<EventRegistration>[] = [
    { key: "memberName", header: "Member", render: (r) => <span className="text-white">{r.memberName}</span> },
    { key: "eventId", header: "Event", render: (r) => <span className="text-gray-400 font-mono text-xs">{r.eventId.slice(0, 12)}...</span> },
    { key: "ticketType", header: "Ticket", render: (r) => <span className="text-gray-400">{r.ticketType || "-"}</span> },
    { key: "amountPaid", header: "Paid", render: (r) => <span className="text-gray-400">${r.amountPaid.toFixed(2)}</span> },
    { key: "registrationDate", header: "Date", render: (r) => <span className="text-gray-400">{new Date(r.registrationDate).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "Actions", render: (r) => (
        <div className="flex gap-1">
          {r.status === "registered" && (
            <>
              <button
                onClick={() => handleConfirm(r.id)}
                disabled={actingId === r.id}
                className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors disabled:opacity-50"
                title="Confirm"
              >
                {actingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => handleCancel(r.id)}
                disabled={actingId === r.id}
                className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors disabled:opacity-50"
                title="Cancel"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Event Registrations" description="Manage attendee registrations" />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by member name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {Object.entries(REGISTRATION_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" />
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No registrations found." />
        </div>
      )}
    </div>
  )
}
