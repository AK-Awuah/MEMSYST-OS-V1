"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  SPONSORSHIP_STATUS_LABELS,
  SPONSORSHIP_CATEGORY_LABELS,
} from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { Sponsorship, SponsorshipCategory, SponsorshipStatus } from "@/types"

function SponsorshipStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    fulfilled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = SPONSORSHIP_STATUS_LABELS[status as SponsorshipStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function SponsorshipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [sponsorship, setSponsorship] = useState<Sponsorship | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchSponsorship = async () => {
    try {
      const svc = await getSupportHubService()
      const data = await svc.getSponsorship(id)
      setSponsorship(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sponsorship")
    }
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.getSponsorship(id)
        if (!cancelled) setSponsorship(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load sponsorship")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleMarkFulfilled = async () => {
    setActionLoading("fulfill")
    try {
      const svc = await getSupportHubService()
      await svc.updateSponsorship(id, { status: "fulfilled" })
      await fetchSponsorship()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to mark sponsorship as fulfilled")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading sponsorship...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!sponsorship) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Sponsorship not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sponsorships
      </button>

      <PageHeader
        title={sponsorship.title}
        description={`Sponsor: ${sponsorship.sponsorName} — ${SPONSORSHIP_STATUS_LABELS[sponsorship.status as SponsorshipStatus] || sponsorship.status}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Sponsorship Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Sponsor Name</p>
                <p className="text-sm font-medium text-white mt-1">{sponsorship.sponsorName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><SponsorshipStatusBadge status={sponsorship.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-white mt-1">
                  {SPONSORSHIP_CATEGORY_LABELS[sponsorship.category as SponsorshipCategory] || sponsorship.category}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium text-white mt-1">${sponsorship.amount.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Sponsor Contact</p>
                <p className="text-sm font-medium text-white mt-1">{sponsorship.sponsorContact || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(sponsorship.startDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm font-medium text-white mt-1">{sponsorship.endDate ? new Date(sponsorship.endDate).toLocaleDateString() : "-"}</p>
              </div>
              {sponsorship.beneficiaryName && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Beneficiary</p>
                  <p className="text-sm font-medium text-white mt-1">{sponsorship.beneficiaryName}</p>
                </div>
              )}
              {sponsorship.inKindDetails && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">In-Kind Details</p>
                  <p className="text-sm font-medium text-white mt-1">{sponsorship.inKindDetails}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{sponsorship.description || "No description provided."}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {sponsorship.status === "active" && (
                <button
                  onClick={handleMarkFulfilled}
                  disabled={actionLoading === "fulfill"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600/80 text-sm text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "fulfill" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {actionLoading === "fulfill" ? "Fulfilling..." : "Mark as Fulfilled"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
