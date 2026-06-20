"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { COMMITTEE_TYPES, COMMITTEE_TYPE_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { CommitteeType } from "@/types"

export default function NewCommitteePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [committeeType, setCommitteeType] = useState<CommitteeType>("standing")
  const [chairpersonName, setChairpersonName] = useState("")
  const [meetingFrequency, setMeetingFrequency] = useState("")
  const [quorum, setQuorum] = useState("")

  const handleSubmit = async () => {
    if (!name || !chairpersonName || !meetingFrequency) return
    setSubmitting(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.createCommittee({
        tenantId: "tenant-1",
        name,
        description,
        committeeType,
        chairpersonId: "mem-1",
        chairpersonName,
        members: [],
        meetingFrequency,
        quorumRequired: parseInt(quorum || "3", 10),
        formationDate: new Date().toISOString(),
        status: "active",
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/governance-enhanced/committees"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create committee")
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
        <p className="text-lg font-medium text-white">Committee created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting to committees list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Committees
      </button>
      <PageHeader title="New Committee" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Committee name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Committee purpose" rows={3} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
            <select value={committeeType} onChange={(e) => setCommitteeType(e.target.value as CommitteeType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              {COMMITTEE_TYPES.map((t) => (
                <option key={t} value={t}>{COMMITTEE_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Chairperson Name</label>
            <input type="text" value={chairpersonName} onChange={(e) => setChairpersonName(e.target.value)} placeholder="Chairperson name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Meeting Frequency</label>
            <input type="text" value={meetingFrequency} onChange={(e) => setMeetingFrequency(e.target.value)} placeholder="e.g., Monthly, Bi-weekly" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Quorum Required</label>
            <input type="number" value={quorum} onChange={(e) => setQuorum(e.target.value)} placeholder="3" min="1" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || !name || !chairpersonName || !meetingFrequency}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Committee"}
        </button>
      </div>
    </div>
  )
}
