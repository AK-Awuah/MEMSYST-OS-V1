"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Play, XCircle, CheckCircle, Loader2, FileText } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { ELECTION_STATUS_LABELS, CANDIDATE_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Election, Candidate, Vote } from "@/types"

export default function ElectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [election, setElection] = useState<Election | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [opening, setOpening] = useState(false)
  const [closing, setClosing] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const [electionData, candidatesData, votesData] = await Promise.all([
          svc.getElection(id),
          svc.listCandidates(id),
          svc.getVotes(id),
        ])
        if (!cancelled) {
          setElection(electionData)
          setCandidates(candidatesData)
          setVotes(votesData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load election")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleOpen = async () => {
    setOpening(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.openElection(id)
      const data = await svc.getElection(id)
      setElection(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to open election")
    } finally {
      setOpening(false)
    }
  }

  const handleClose = async () => {
    setClosing(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.closeElection(id)
      const data = await svc.getElection(id)
      setElection(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to close election")
    } finally {
      setClosing(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.publishResults(id)
      const data = await svc.getElection(id)
      setElection(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to publish results")
    } finally {
      setPublishing(false)
    }
  }

  const candidateColumns: Column<Candidate>[] = [
    { key: "memberName", header: "Candidate", render: (c) => <span className="text-white">{c.memberName}</span> },
    { key: "voteCount", header: "Votes", render: (c) => <span className="text-white font-mono">{c.voteCount}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "nominationDate", header: "Nominated", render: (c) => <span className="text-gray-400">{new Date(c.nominationDate).toLocaleDateString()}</span> },
    {
      key: "actions", header: "Actions", render: (c) => (
        <div className="flex gap-1">
          {c.status === "nominated" && (
            <>
              <button
                onClick={async () => {
                  try {
                    const svc = await getGovernanceEnhancedService()
                    await svc.approveCandidate(c.id, "admin-1")
                    setCandidates((prev) => prev.map((x) => x.id === c.id ? { ...x, status: "approved" as const, nominationApproved: true } : x))
                  } catch { /* ignore */ }
                }}
                className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors"
                title="Approve"
              >
                <CheckCircle className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={async () => {
                  try {
                    const svc = await getGovernanceEnhancedService()
                    await svc.disqualifyCandidate(c.id)
                    setCandidates((prev) => prev.map((x) => x.id === c.id ? { ...x, status: "disqualified" as const } : x))
                  } catch { /* ignore */ }
                }}
                className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors"
                title="Disqualify"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  const voteColumns: Column<Vote>[] = [
    { key: "voterId", header: "Voter", render: (v) => <span className="text-gray-400 font-mono text-xs">{v.voterId.slice(0, 12)}...</span> },
    { key: "candidateId", header: "Candidate", render: (v) => <span className="text-gray-400 font-mono text-xs">{v.candidateId.slice(0, 12)}...</span> },
    { key: "votedAt", header: "Date", render: (v) => <span className="text-gray-400">{new Date(v.votedAt).toLocaleString()}</span> },
    { key: "isVerified", header: "Verified", render: (v) => <span className={v.isVerified ? "text-green-400" : "text-red-400"}>{v.isVerified ? "Yes" : "No"}</span> },
  ]

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  }

  if (error || !election) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Election not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Elections
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={election.title} description={election.positionName} />
        <div className="flex gap-2">
          {election.status === "draft" && (
            <button onClick={handleOpen} disabled={opening} className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">
              {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {opening ? "Opening..." : "Open Election"}
            </button>
          )}
          {election.status === "voting" && (
            <button onClick={handleClose} disabled={closing} className="inline-flex items-center gap-2 rounded-lg bg-red-600/80 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50">
              {closing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              {closing ? "Closing..." : "Close Voting"}
            </button>
          )}
          {election.status === "count" && (
            <button onClick={handlePublish} disabled={publishing} className="inline-flex items-center gap-2 rounded-lg bg-green-600/80 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:opacity-50">
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {publishing ? "Publishing..." : "Publish Results"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Election Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={election.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Position</p>
                <p className="text-sm font-medium text-white mt-1">{election.positionName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Level</p>
                <p className="text-sm font-medium text-white mt-1">{election.organizationalLevel}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Voting Period</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(election.votingStartDate).toLocaleDateString()} - {new Date(election.votingEndDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Voters / Votes</p>
                <p className="text-sm font-medium text-white mt-1">{election.totalVotesCast} / {election.totalVoters}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Turnout</p>
                <p className="text-sm font-medium text-white mt-1">{(election.voterTurnout * 100).toFixed(1)}%</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Anonymous</p>
                <p className="text-sm font-medium text-white mt-1">{election.isAnonymous ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">2FA Required</p>
                <p className="text-sm font-medium text-white mt-1">{election.requiresTwoFactorAuth ? "Yes" : "No"}</p>
              </div>
            </div>
            {election.description && (
              <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-white mt-1">{election.description}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Candidates ({candidates.length})</h3>
            <DataTable columns={candidateColumns} data={candidates} emptyMessage="No candidates nominated yet." />
          </div>

          {election.status !== "draft" && election.status !== "nomination" && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Votes Cast ({votes.length})</h3>
              <DataTable columns={voteColumns} data={votes} emptyMessage="No votes cast yet." />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Voting Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Total Voters</span>
                <span className="text-sm font-medium text-white">{election.totalVoters}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Votes Cast</span>
                <span className="text-sm font-medium text-white">{election.totalVotesCast}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Turnout</span>
                <span className="text-sm font-medium text-white">{(election.voterTurnout * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Max Candidates</span>
                <span className="text-sm font-medium text-white">{election.maxCandidates}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
