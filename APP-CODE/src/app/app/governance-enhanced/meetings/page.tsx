"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { MEETING_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { CommitteeMeeting } from "@/types"

export default function MeetingsListPage() {
  const [meetings, setMeetings] = useState<CommitteeMeeting[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const committees = await svc.listCommittees("tenant-1")
        let allMeetings: CommitteeMeeting[] = []
        for (const committee of committees) {
          const meetingsData = await svc.listMeetings(committee.id)
          allMeetings = [...allMeetings, ...meetingsData]
        }
        if (!cancelled) setMeetings(allMeetings)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = meetings.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || m.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: Column<CommitteeMeeting>[] = [
    { key: "title", header: "Title", render: (m) => (
      <Link href={`/app/governance-enhanced/meetings/${m.id}`} className="text-[#3CA4F9] hover:underline font-medium">{m.title}</Link>
    )},
    { key: "committeeName", header: "Committee", render: (m) => <span className="text-gray-400">{m.committeeName}</span> },
    { key: "meetingDate", header: "Date", render: (m) => <span className="text-gray-400">{new Date(m.meetingDate).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (m) => <StatusBadge status={m.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Meetings" description="Committee meetings and minutes" />
        <Link
          href="/app/governance-enhanced/meetings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Schedule Meeting
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search meetings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
          <option value="all">All Statuses</option>
          {Object.entries(MEETING_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No meetings found." />
        </div>
      )}
    </div>
  )
}
