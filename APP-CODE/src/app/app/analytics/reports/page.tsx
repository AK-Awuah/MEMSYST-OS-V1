"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Play } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { REPORT_TYPE_LABELS, REPORT_FORMAT_LABELS, REPORT_SCHEDULE_LABELS } from "@/lib/constants"
import { getAnalyticsService } from "@/lib/services"
import type { Report, ReportExecution } from "@/types"

export default function ReportsListPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAnalyticsService()
        const data = await svc.listReports("tenant-1")
        if (!cancelled) setReports(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleGenerate = async (id: string) => {
    setGeneratingId(id)
    try {
      const svc = await getAnalyticsService()
      await svc.generateReport(id, "manual")
      alert("Report generation started!")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to generate report")
    } finally {
      setGeneratingId(null)
    }
  }

  const filtered = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || r.reportType === typeFilter
    return matchesSearch && matchesType
  })

  const columns: Column<Report>[] = [
    { key: "title", header: "Title", render: (r) => (
      <Link href={`/app/analytics/reports/${r.id}`} className="text-[#3CA4F9] hover:underline font-medium">{r.title}</Link>
    )},
    { key: "reportType", header: "Type", render: (r) => <span className="text-gray-400">{REPORT_TYPE_LABELS[r.reportType]}</span> },
    { key: "format", header: "Format", render: (r) => <span className="text-gray-400">{REPORT_FORMAT_LABELS[r.format]}</span> },
    { key: "schedule", header: "Schedule", render: (r) => <span className="text-gray-400">{REPORT_SCHEDULE_LABELS[r.schedule]}</span> },
    { key: "lastGenerated", header: "Last Generated", render: (r) => <span className="text-gray-400">{r.lastGenerated ? new Date(r.lastGenerated).toLocaleDateString() : "Never"}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "", render: (r) => (
        <button
          onClick={() => handleGenerate(r.id)}
          disabled={generatingId === r.id}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#3CA4F9]/20 text-[#3CA4F9] text-xs hover:bg-[#3CA4F9]/30 transition-colors disabled:opacity-50"
        >
          {generatingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
          Generate
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Reports" description="Create and manage analytics reports" />
        <Link
          href="/app/analytics/reports/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Report
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
          <option value="all">All Types</option>
          {Object.entries(REPORT_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No reports found." />
        </div>
      )}
    </div>
  )
}
