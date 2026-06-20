"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { ELECTION_STATUSES, ELECTION_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { ElectionStatus } from "@/types"

export default function NewElectionPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [positionName, setPositionName] = useState("")
  const [organizationalLevel, setOrganizationalLevel] = useState("")
  const [nominationStart, setNominationStart] = useState("")
  const [nominationEnd, setNominationEnd] = useState("")
  const [votingStart, setVotingStart] = useState("")
  const [votingEnd, setVotingEnd] = useState("")
  const [maxCandidates, setMaxCandidates] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)

  const handleSubmit = async () => {
    if (!title || !positionName || !votingStart || !votingEnd) return
    setSubmitting(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.createElection({
        tenantId: "tenant-1",
        title,
        description,
        positionId: "pos-1",
        positionName,
        organizationalLevel: organizationalLevel || "general",
        nominationStartDate: new Date(nominationStart || votingStart).toISOString(),
        nominationEndDate: new Date(nominationEnd || votingStart).toISOString(),
        votingStartDate: new Date(votingStart).toISOString(),
        votingEndDate: new Date(votingEnd).toISOString(),
        maxCandidates: parseInt(maxCandidates || "10", 10),
        minVotesPerVoter: 1,
        maxVotesPerVoter: 1,
        isAnonymous,
        requiresTwoFactorAuth: requires2FA,
        status: "draft",
        totalVoters: 0,
        totalVotesCast: 0,
        voterTurnout: 0,
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/governance-enhanced/elections"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create election")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Save className="h-8 w-8 text-green-400" />
        </div>
        <p className="text-lg font-medium text-white">Election created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting to elections list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Elections
      </button>
      <PageHeader title="New Election" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Election title" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Election description" rows={3} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Position Name</label>
            <input type="text" value={positionName} onChange={(e) => setPositionName(e.target.value)} placeholder="e.g., President" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organizational Level</label>
            <input type="text" value={organizationalLevel} onChange={(e) => setOrganizationalLevel(e.target.value)} placeholder="e.g., National" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nomination Start</label>
            <input type="datetime-local" value={nominationStart} onChange={(e) => setNominationStart(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nomination End</label>
            <input type="datetime-local" value={nominationEnd} onChange={(e) => setNominationEnd(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Voting Start</label>
            <input type="datetime-local" value={votingStart} onChange={(e) => setVotingStart(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Voting End</label>
            <input type="datetime-local" value={votingEnd} onChange={(e) => setVotingEnd(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Candidates</label>
            <input type="number" value={maxCandidates} onChange={(e) => setMaxCandidates(e.target.value)} placeholder="10" min="1" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div className="flex items-end gap-4 pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded border-[#1e3a5f] bg-[#012a42] text-[#3CA4F9] focus:ring-[#3CA4F9]" />
              <span className="text-sm text-gray-300">Anonymous Voting</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={requires2FA} onChange={(e) => setRequires2FA(e.target.checked)} className="rounded border-[#1e3a5f] bg-[#012a42] text-[#3CA4F9] focus:ring-[#3CA4F9]" />
              <span className="text-sm text-gray-300">Require 2FA</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title || !positionName || !votingStart || !votingEnd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Election"}
        </button>
      </div>
    </div>
  )
}
