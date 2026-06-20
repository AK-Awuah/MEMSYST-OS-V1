"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { WORKSHOP_STATUS_LABELS } from "@/lib/constants"
import { getEventsService } from "@/lib/services"
import type { Workshop } from "@/types"

export default function WorkshopsListPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        const svc = await getEventsService()
        const data = await svc.listWorkshops("tenant-1")
        if (!cancelled) setWorkshops(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = workshops.filter((w) => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || w.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: Column<Workshop>[] = [
    { key: "title", header: "Title", render: (w) => (
      <Link href={`/app/events/workshops/${w.id}`} className="text-[#3CA4F9] hover:underline font-medium">
        {w.title}
      </Link>
    )},
    { key: "facilitatorName", header: "Facilitator", render: (w) => <span className="text-gray-400">{w.facilitatorName}</span> },
    { key: "startDate", header: "Date", render: (w) => <span className="text-gray-400">{new Date(w.startDate).toLocaleDateString()}</span> },
    { key: "duration", header: "Duration", render: (w) => <span className="text-gray-400">{w.duration}</span> },
    { key: "registeredCount", header: "Enrolled", render: (w) => <span className="text-white">{w.registeredCount}/{w.maxParticipants}</span> },
    { key: "status", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Workshops" description="Manage training workshops and sessions" />
        <Link
          href="/app/events/workshops/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Workshop
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search workshops..."
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
          {Object.entries(WORKSHOP_STATUS_LABELS).map(([k, v]) => (
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
          <DataTable columns={columns} data={filtered} emptyMessage="No workshops found." />
        </div>
      )}
    </div>
  )
}
