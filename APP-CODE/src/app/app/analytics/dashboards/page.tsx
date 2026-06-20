"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAnalyticsService } from "@/lib/services"
import type { CustomDashboard } from "@/types"

export default function DashboardsListPage() {
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAnalyticsService()
        const data = await svc.listDashboards("tenant-1")
        if (!cancelled) setDashboards(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this dashboard?")) return
    try {
      const svc = await getAnalyticsService()
      await svc.deleteDashboard(id)
      setDashboards((prev) => prev.filter((d) => d.id !== id))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete")
    }
  }

  const filtered = dashboards.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<CustomDashboard>[] = [
    { key: "name", header: "Name", render: (d) => (
      <Link href={`/app/analytics/dashboards/${d.id}`} className="text-[#3CA4F9] hover:underline font-medium">{d.name}</Link>
    )},
    { key: "description", header: "Description", render: (d) => <span className="text-gray-400">{d.description || "-"}</span> },
    { key: "isDefault", header: "Default", render: (d) => <span className={d.isDefault ? "text-green-400" : "text-gray-500"}>{d.isDefault ? "Yes" : "No"}</span> },
    { key: "widgets", header: "Widgets", render: (d) => <span className="text-white">{d.widgets.length}</span> },
    {
      key: "actions", header: "", render: (d) => (
        <button onClick={() => handleDelete(d.id)}
          className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors" title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Dashboards" description="Custom dashboards and widgets" />
        <Link
          href="/app/analytics/dashboards/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Dashboard
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search dashboards..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No dashboards found." />
        </div>
      )}
    </div>
  )
}
