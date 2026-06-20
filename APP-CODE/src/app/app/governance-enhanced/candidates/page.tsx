"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { CANDIDATE_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Candidate } from "@/types"

export default function CandidatesListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [electionId, setElectionId] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const elections = await svc.listElections("tenant-1")
        let allCandidates: Candidate[] = []
        for (const election of elections) {
          const cands = await svc.listCandidates(election.id)
          allCandidates = [...allCandidates, ...cands]
        }
        if (!cancelled) setCandidates(allCandidates)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = candidates.filter((c) =>
    c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.electionId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Candidate>[] = [
    { key: "memberName", header: "Candidate", render: (c) => <span className="text-white">{c.memberName}</span> },
    { key: "electionId", header: "Election", render: (c) => <span className="text-gray-400 font-mono text-xs">{c.electionId.slice(0, 12)}...</span> },
    { key: "voteCount", header: "Votes", render: (c) => <span className="text-white">{c.voteCount}</span> },
    { key: "nominationDate", header: "Nominated", render: (c) => <span className="text-gray-400">{new Date(c.nominationDate).toLocaleDateString()}</span> },
    { key: "nominationApproved", header: "Approved", render: (c) => <span className={c.nominationApproved ? "text-green-400" : "text-red-400"}>{c.nominationApproved ? "Yes" : "No"}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Candidates" description="View all nominated candidates" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No candidates found." />
        </div>
      )}
    </div>
  )
}
