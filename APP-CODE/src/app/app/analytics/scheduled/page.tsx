"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAnalyticsService } from "@/lib/services"
import type { Report, ReportExecution } from "@/types"

export default function ScheduledReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAnalyticsService()
        const data = await svc.listReports("tenant-1")
        if (!cancelled) setReports(data.filter((r) => r.schedule !== "none"))
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Report>[] = [
    { key: "title", header: "Title", render: (r) => <span className="text-white">{r.title}</span> },
    { key: "schedule", header: "Schedule", render: (r) => <span className="text-gray-400 capitalize">{r.schedule}</span> },
    { key: "lastGenerated", header: "Last Generated", render: (r) => <span className="text-gray-400">{r.lastGenerated ? new Date(r.lastGenerated).toLocaleDateString() : "Never"}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Scheduled Reports" description="Reports with automated scheduling" />

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search scheduled reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No scheduled reports." />
        </div>
      )}
    </div>
  )
}
