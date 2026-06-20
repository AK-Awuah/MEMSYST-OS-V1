"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { WORKSHOP_STATUS_LABELS } from "@/lib/constants"
import { getEventsService } from "@/lib/services"
import type { Workshop } from "@/types"

export default function WorkshopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getEventsService()
        const data = await svc.getWorkshop(id)
        if (!cancelled) setWorkshop(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load workshop")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Workshop not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Workshops
      </button>

      <PageHeader title={workshop.title} description={`Facilitated by ${workshop.facilitatorName}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Workshop Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Facilitator</p>
                <p className="text-sm font-medium text-white mt-1">{workshop.facilitatorName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={workshop.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(workshop.startDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-white mt-1">{workshop.duration}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Enrolled</p>
                <p className="text-sm font-medium text-white mt-1">{workshop.registeredCount}/{workshop.maxParticipants}</p>
              </div>
              {workshop.location && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-white mt-1">{workshop.location}</p>
                </div>
              )}
              {workshop.virtualLink && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Virtual Link</p>
                  <p className="text-sm font-medium text-white mt-1">
                    <a href={workshop.virtualLink} target="_blank" rel="noopener noreferrer" className="text-[#3CA4F9] hover:underline">
                      Join Online
                    </a>
                  </p>
                </div>
              )}
            </div>
            {workshop.description && (
              <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-white mt-1">{workshop.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {workshop.materials.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Materials</h3>
              <ul className="space-y-1.5">
                {workshop.materials.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3CA4F9]" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {workshop.prerequisites.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Prerequisites</h3>
              <ul className="space-y-1.5">
                {workshop.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
