"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, Trash2, Loader2, GraduationCap } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  GRADUATION_STATUS_LABELS,
} from "@/lib/constants"
import { getGraduationService } from "@/lib/services"
import type { Graduation, GraduationStatus } from "@/types"

function GraduationStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    approved: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    graduated: "bg-green-500/15 text-green-400 border-green-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = GRADUATION_STATUS_LABELS[status as GraduationStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

function ProgressCheck({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
      {done ? (
        <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-500 shrink-0" />
      )}
      <span className={`text-sm ${done ? "text-green-400" : "text-gray-400"}`}>{label}</span>
    </div>
  )
}

export default function GraduationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [graduation, setGraduation] = useState<Graduation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchGraduation = async () => {
    try {
      const svc = await getGraduationService()
      const data = await svc.getGraduation(id)
      setGraduation(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load graduation")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGraduationService()
        const data = await svc.getGraduation(id)
        if (!cancelled) setGraduation(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load graduation")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleAction = async (action: string, handler: () => Promise<void>) => {
    setActionLoading(action)
    try {
      await handler()
      await fetchGraduation()
    } catch (e) {
      alert(e instanceof Error ? e.message : `Failed to ${action}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this graduation record?")) return
    setActionLoading("delete")
    try {
      const svc = await getGraduationService()
      await svc.deleteGraduation(id)
      router.push("/app/training/graduations")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading graduation...</p>
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

  if (!graduation) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Graduation record not found.</div>
      </div>
    )
  }

  const canApprove = graduation.status === "pending_review"
  const canGraduate = graduation.status === "approved"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Graduations
      </button>

      <PageHeader
        title={graduation.apprenticeName}
        description={`Status: ${GRADUATION_STATUS_LABELS[graduation.status as GraduationStatus] || graduation.status}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Graduation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Apprentice</p>
                <p className="text-sm font-medium text-white mt-1">{graduation.apprenticeName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><GraduationStatusBadge status={graduation.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Upgrade Eligible</p>
                <p className="text-sm font-medium text-white mt-1">{graduation.upgradeEligible ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Graduation Date</p>
                <p className="text-sm font-medium text-white mt-1">{graduation.graduationDate ? new Date(graduation.graduationDate).toLocaleDateString() : "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(graduation.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Updated At</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(graduation.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Progress Checklist</h3>
            <div className="space-y-2">
              <ProgressCheck label="Training Complete" done={graduation.trainingComplete} />
              <ProgressCheck label="Assessment Complete" done={graduation.assessmentComplete} />
              <ProgressCheck label="Executive Review Complete" done={graduation.executiveReviewComplete} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {canApprove && (
                <button
                  onClick={() => handleAction("approve", async () => {
                    const svc = await getGraduationService()
                    await svc.updateGraduationStatus(id, "approved")
                  })}
                  disabled={actionLoading === "approve"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600/80 text-sm text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {actionLoading === "approve" ? "Approving..." : "Approve"}
                </button>
              )}
              {canGraduate && (
                <button
                  onClick={() => handleAction("graduate", async () => {
                    const svc = await getGraduationService()
                    await svc.approveGraduation(id)
                  })}
                  disabled={actionLoading === "graduate"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "graduate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
                  {actionLoading === "graduate" ? "Graduating..." : "Mark as Graduated"}
                </button>
              )}
              {graduation.status !== "graduated" && (
                <button
                  onClick={() => handleAction("reject", async () => {
                    const svc = await getGraduationService()
                    await svc.updateGraduationStatus(id, "rejected")
                  })}
                  disabled={actionLoading === "reject"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  {actionLoading === "reject" ? "Rejecting..." : "Reject"}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={actionLoading === "delete"}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {actionLoading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {actionLoading === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
