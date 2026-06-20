"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { ELECTION_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Election, GovernanceDashboardMetrics } from "@/types"

export default function ElectionsListPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [metrics, setMetrics] = useState<GovernanceDashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const [electionsData, metricsData] = await Promise.all([
          svc.listElections("tenant-1"),
          svc.getDashboardMetrics("tenant-1"),
        ])
        if (!cancelled) {
          setElections(electionsData)
          setMetrics(metricsData)
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = elections.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: Column<Election>[] = [
    { key: "title", header: "Title", render: (e) => (
      <Link href={`/app/governance-enhanced/elections/${e.id}`} className="text-[#3CA4F9] hover:underline font-medium">{e.title}</Link>
    )},
    { key: "positionName", header: "Position", render: (e) => <span className="text-gray-400">{e.positionName}</span> },
    { key: "votingStartDate", header: "Voting Starts", render: (e) => <span className="text-gray-400">{new Date(e.votingStartDate).toLocaleDateString()}</span> },
    { key: "votingEndDate", header: "Ends", render: (e) => <span className="text-gray-400">{new Date(e.votingEndDate).toLocaleDateString()}</span> },
    { key: "totalVoters", header: "Voters", render: (e) => <span className="text-white">{e.totalVoters}</span> },
    { key: "totalVotesCast", header: "Votes", render: (e) => <span className="text-white">{e.totalVotesCast}</span> },
    { key: "voterTurnout", header: "Turnout", render: (e) => <span className="text-gray-400">{(e.voterTurnout * 100).toFixed(1)}%</span> },
    { key: "status", header: "Status", render: (e) => <StatusBadge status={e.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Elections" description="Manage elections and voting" />
        <Link
          href="/app/governance-enhanced/elections/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Election
        </Link>
      </div>

      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Elections" value={metrics.totalElections} />
          <StatCard title="Active" value={metrics.activeElections} />
          <StatCard title="Candidates" value={metrics.totalCandidates} />
          <StatCard title="Votes Cast" value={metrics.totalVotesCast} />
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search elections..."
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
          {Object.entries(ELECTION_STATUS_LABELS).map(([k, v]) => (
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
          <DataTable columns={columns} data={filtered} emptyMessage="No elections found." />
        </div>
      )}
    </div>
  )
}
