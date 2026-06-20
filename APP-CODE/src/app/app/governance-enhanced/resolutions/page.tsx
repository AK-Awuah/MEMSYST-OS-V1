"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, BookCheck, XCircle } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { RESOLUTION_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Resolution } from "@/types"

export default function ResolutionsListPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const data = await svc.listResolutions("tenant-1")
        if (!cancelled) setResolutions(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = resolutions.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: Column<Resolution>[] = [
    { key: "title", header: "Title", render: (r) => (
      <Link href={`/app/governance-enhanced/resolutions/${r.id}`} className="text-[#3CA4F9] hover:underline font-medium">{r.title}</Link>
    )},
    { key: "proposedByName", header: "Proposed By", render: (r) => <span className="text-gray-400">{r.proposedByName}</span> },
    { key: "voteCount", header: "Votes", render: (r) => <span className="text-white">{r.voteCount}</span> },
    { key: "votesFor", header: "For", render: (r) => <span className="text-green-400">{r.votesFor}</span> },
    { key: "votesAgainst", header: "Against", render: (r) => <span className="text-red-400">{r.votesAgainst}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Resolutions" description="Propose and manage resolutions" />
        <Link
          href="/app/governance-enhanced/resolutions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Propose Resolution
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search resolutions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
          <option value="all">All Statuses</option>
          {Object.entries(RESOLUTION_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No resolutions found." />
        </div>
      )}
    </div>
  )
}
