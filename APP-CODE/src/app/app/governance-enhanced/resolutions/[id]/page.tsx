"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, BookCheck, CheckCircle, Settings as SettingsIcon } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { RESOLUTION_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Resolution } from "@/types"

export default function ResolutionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [resolution, setResolution] = useState<Resolution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [passing, setPassing] = useState(false)
  const [implementing, setImplementing] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const data = await svc.getResolution(id)
        if (!cancelled) {
          setResolution(data)
          if (data?.implementationNotes) setNotes(data.implementationNotes)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load resolution")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handlePass = async () => {
    setPassing(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.passResolution(id)
      const data = await svc.getResolution(id)
      setResolution(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to pass resolution")
    } finally {
      setPassing(false)
    }
  }

  const handleImplement = async () => {
    if (!notes) return
    setImplementing(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.implementResolution(id, notes)
      const data = await svc.getResolution(id)
      setResolution(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to implement resolution")
    } finally {
      setImplementing(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>

  if (error || !resolution) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Resolution not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Resolutions
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={resolution.title} description={`Proposed by ${resolution.proposedByName}`} />
        <div className="flex gap-2">
          {resolution.status === "proposed" && (
            <button onClick={handlePass} disabled={passing}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600/80 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:opacity-50 transition-colors">
              {passing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookCheck className="h-4 w-4" />}
              {passing ? "Passing..." : "Pass Resolution"}
            </button>
          )}
          {resolution.status === "passed" && (
            <button onClick={handleImplement} disabled={implementing || !notes}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50 transition-colors">
              {implementing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              {implementing ? "Implementing..." : "Mark Implemented"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Resolution Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={resolution.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Proposed By</p>
                <p className="text-sm text-white mt-1">{resolution.proposedByName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Total Votes</p>
                <p className="text-sm text-white mt-1">{resolution.voteCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">For / Against / Abstain</p>
                <p className="text-sm text-white mt-1">{resolution.votesFor} / {resolution.votesAgainst} / {resolution.votesAbstain}</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-white mt-1">{resolution.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {resolution.status === "passed" && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Implementation Notes</h3>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe implementation steps..."
                rows={4}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
            </div>
          )}
          {resolution.implementationNotes && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Implementation Notes</h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{resolution.implementationNotes}</p>
              {resolution.implementedDate && (
                <p className="text-xs text-gray-500 mt-2">Implemented: {new Date(resolution.implementedDate).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
