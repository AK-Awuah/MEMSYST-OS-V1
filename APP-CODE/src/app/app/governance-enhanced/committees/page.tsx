"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { COMMITTEE_TYPE_LABELS, COMMITTEE_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Committee } from "@/types"

export default function CommitteesListPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const data = await svc.listCommittees("tenant-1")
        if (!cancelled) setCommittees(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = committees.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || c.committeeType === typeFilter
    return matchesSearch && matchesType
  })

  const columns: Column<Committee>[] = [
    { key: "name", header: "Name", render: (c) => (
      <Link href={`/app/governance-enhanced/committees/${c.id}`} className="text-[#3CA4F9] hover:underline font-medium">{c.name}</Link>
    )},
    { key: "committeeType", header: "Type", render: (c) => <span className="text-gray-400">{COMMITTEE_TYPE_LABELS[c.committeeType]}</span> },
    { key: "chairpersonName", header: "Chairperson", render: (c) => <span className="text-gray-400">{c.chairpersonName}</span> },
    { key: "meetingFrequency", header: "Frequency", render: (c) => <span className="text-gray-400 capitalize">{c.meetingFrequency}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Committees" description="Manage committees and subcommittees" />
        <Link
          href="/app/governance-enhanced/committees/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Committee
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search committees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
          <option value="all">All Types</option>
          {Object.entries(COMMITTEE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No committees found." />
        </div>
      )}
    </div>
  )
}
