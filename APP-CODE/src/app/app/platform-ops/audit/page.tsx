"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getPlatformOpsService } from "@/lib/services"
import type { PlatformOpsAuditLog } from "@/types"

export default function PlatformOpsAuditPage() {
  const [logs, setLogs] = useState<PlatformOpsAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        const svc = await getPlatformOpsService()
        const data = await svc.getAuditLogs()
        if (!cancelled) setLogs(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) || l.actor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<PlatformOpsAuditLog>[] = [
    { key: "createdAt", header: "Date", render: (l) => <span className="text-gray-400 text-xs">{new Date(l.createdAt).toLocaleString()}</span> },
    { key: "actor", header: "Actor", render: (l) => <span className="text-white text-sm">{l.actor}</span> },
    { key: "action", header: "Action", render: (l) => <span className="text-sm text-gray-300 capitalize">{l.action.replace(/_/g, " ")}</span> },
    { key: "recordType", header: "Record", render: (l) => <span className="text-gray-400 text-xs">{l.recordType}</span> },
    { key: "recordId", header: "Record ID", render: (l) => <span className="text-gray-500 font-mono text-xs">{l.recordId.slice(0, 12)}...</span> },
    { key: "details", header: "Details", render: (l) => <span className="text-gray-400 text-xs">{l.details || "-"}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Operations Audit Log" description="Track platform operations changes" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search by action or actor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No audit logs found." />
        </div>
      )}
    </div>
  )
}
