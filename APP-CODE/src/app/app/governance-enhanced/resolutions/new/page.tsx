"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getGovernanceEnhancedService } from "@/lib/services"

export default function NewResolutionPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [proposedByName, setProposedByName] = useState("")
  const [implementationNotes, setImplementationNotes] = useState("")

  const handleSubmit = async () => {
    if (!title || !description || !proposedByName) return
    setSubmitting(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.proposeResolution({
        tenantId: "tenant-1",
        title,
        description,
        proposedById: "mem-1",
        proposedByName,
        voteCount: 0,
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        status: "proposed",
        implementationNotes: implementationNotes || undefined,
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/governance-enhanced/resolutions"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to propose resolution")
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
        <p className="text-lg font-medium text-white">Resolution proposed successfully!</p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Resolutions
      </button>
      <PageHeader title="Propose Resolution" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resolution title" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of the resolution" rows={5}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Proposed By</label>
            <input type="text" value={proposedByName} onChange={(e) => setProposedByName(e.target.value)} placeholder="Proposer name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Implementation Notes</label>
            <input type="text" value={implementationNotes} onChange={(e) => setImplementationNotes(e.target.value)} placeholder="How this will be implemented" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || !title || !description || !proposedByName}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Proposing..." : "Propose Resolution"}
        </button>
      </div>
    </div>
  )
}
