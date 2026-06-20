"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Ban, RefreshCw, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  TRAINING_CENTER_STATUS_LABELS,
} from "@/lib/constants"
import { getTrainingCenterService } from "@/lib/services"
import type { TrainingCenter, TrainingCenterStatus } from "@/types"

function AccreditationBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-500/15 text-red-400 border-red-500/30",
    expired: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    closed: "bg-gray-700/30 text-gray-500 border-gray-600/40",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = TRAINING_CENTER_STATUS_LABELS[status as TrainingCenterStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function TrainingCenterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [center, setCenter] = useState<TrainingCenter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchCenter = async () => {
    try {
      const svc = await getTrainingCenterService()
      const data = await svc.getTrainingCenter(id)
      setCenter(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load center")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTrainingCenterService()
        const data = await svc.getTrainingCenter(id)
        if (!cancelled) setCenter(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load training center")
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
      await fetchCenter()
    } catch (e) {
      alert(e instanceof Error ? e.message : `Failed to ${action} center`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this training center? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getTrainingCenterService()
      await svc.deleteTrainingCenter(id)
      router.push("/app/training/centers")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete center")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading training center...</p>
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

  if (!center) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Training center not found.</div>
      </div>
    )
  }

  const isPending = center.accreditationStatus === "pending"
  const isActive = center.accreditationStatus === "active"
  const isSuspended = center.accreditationStatus === "suspended"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Centers
      </button>

      <PageHeader
        title={center.name}
        description={`Location: ${center.location} — Accreditation: ${TRAINING_CENTER_STATUS_LABELS[center.accreditationStatus as TrainingCenterStatus] || center.accreditationStatus}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Center Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-white mt-1">{center.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Accreditation Status</p>
                <div className="mt-1"><AccreditationBadge status={center.accreditationStatus} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Operational Status</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">{center.status}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-white mt-1">{center.location}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Owner</p>
                <p className="text-sm font-medium text-white mt-1">{center.ownerName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Owner ID</p>
                <p className="text-sm font-medium text-white mt-1">{center.ownerId}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Contact Info</p>
                <p className="text-sm font-medium text-white mt-1">{center.contactInfo || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(center.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Courses Offered</h3>
            {center.coursesOffered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {center.coursesOffered.map((course, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1 text-xs font-medium text-[#3CA4F9]"
                  >
                    {course}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No courses listed yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {isPending && (
                <button
                  onClick={() => handleAction("approve", async () => {
                    const svc = await getTrainingCenterService()
                    await svc.approveCenter(id)
                  })}
                  disabled={actionLoading === "approve"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {actionLoading === "approve" ? "Approving..." : "Approve Center"}
                </button>
              )}
              {isActive && (
                <button
                  onClick={() => handleAction("suspend", async () => {
                    const svc = await getTrainingCenterService()
                    await svc.suspendCenter(id)
                  })}
                  disabled={actionLoading === "suspend"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "suspend" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                  {actionLoading === "suspend" ? "Suspending..." : "Suspend Center"}
                </button>
              )}
              {(isSuspended || center.accreditationStatus === "expired") && (
                <button
                  onClick={() => handleAction("renew", async () => {
                    const svc = await getTrainingCenterService()
                    await svc.renewAccreditation(id)
                  })}
                  disabled={actionLoading === "renew"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "renew" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {actionLoading === "renew" ? "Renewing..." : "Renew Accreditation"}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={actionLoading === "delete"}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
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
