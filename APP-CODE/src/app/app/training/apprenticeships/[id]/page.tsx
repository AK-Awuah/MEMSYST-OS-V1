"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Loader2, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  APPRENTICESHIP_TRAINING_STATUS_LABELS,
} from "@/lib/constants"
import { getApprenticeshipTrainingService } from "@/lib/services"
import type { ApprenticeshipTraining, ApprenticeshipTrainingStatus } from "@/types"

export default function ApprenticeshipTrainingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [training, setTraining] = useState<ApprenticeshipTraining | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchTraining = async () => {
    try {
      const svc = await getApprenticeshipTrainingService()
      const data = await svc.getApprenticeshipTraining(id)
      setTraining(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load training")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getApprenticeshipTrainingService()
        const data = await svc.getApprenticeshipTraining(id)
        if (!cancelled) setTraining(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load training")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleUpdateStatus = async (status: ApprenticeshipTrainingStatus) => {
    setActionLoading(status)
    try {
      const svc = await getApprenticeshipTrainingService()
      await svc.updateApprenticeshipStatus(id, status)
      await fetchTraining()
    } catch (e) {
      alert(e instanceof Error ? e.message : `Failed to update status`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this training record? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getApprenticeshipTrainingService()
      await svc.deleteApprenticeshipTraining(id)
      router.push("/app/training/apprenticeships")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete training")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading training details...</p>
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

  if (!training) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Training record not found.</div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    registered: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    under_assessment: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    completed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    graduated: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    upgraded: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Apprenticeships
      </button>

      <PageHeader
        title={training.apprenticeName}
        description={`Mentor: ${training.mentorName}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Training Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Apprentice</p>
                <p className="text-sm font-medium text-white mt-1">{training.apprenticeName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Mentor</p>
                <p className="text-sm font-medium text-white mt-1">{training.mentorName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block mt-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[training.status] || ""}`}>
                  {APPRENTICESHIP_TRAINING_STATUS_LABELS[training.status as ApprenticeshipTrainingStatus] || training.status}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Training Center</p>
                <p className="text-sm font-medium text-white mt-1">{training.trainingCenterId}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Program</p>
                <p className="text-sm font-medium text-white mt-1">{training.programId || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(training.startDate).toLocaleDateString()}</p>
              </div>
              {training.endDate && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-white mt-1">{new Date(training.endDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-[#1e3a5f] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3CA4F9] to-green-400 transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, training.progress))}%` }}
                />
              </div>
              <span className="text-lg font-bold text-white">{training.progress}%</span>
            </div>
          </div>

          {training.skillsAcquired.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Skills Acquired</h3>
              <div className="flex flex-wrap gap-2">
                {training.skillsAcquired.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1 text-xs font-medium text-[#3CA4F9]"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Update Status</h3>
            <div className="space-y-2">
              {["registered", "active", "under_assessment", "completed", "graduated", "upgraded"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(s as ApprenticeshipTrainingStatus)}
                  disabled={actionLoading === s || training.status === s}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                    training.status === s
                      ? "bg-[#3CA4F9]/20 text-[#3CA4F9] border border-[#3CA4F9]/30"
                      : "border border-[#1e3a5f] text-gray-300 hover:bg-[#1e3a5f]/50"
                  }`}
                >
                  {actionLoading === s ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {APPRENTICESHIP_TRAINING_STATUS_LABELS[s as ApprenticeshipTrainingStatus]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
            <button
              onClick={handleDelete}
              disabled={actionLoading === "delete"}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {actionLoading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {actionLoading === "delete" ? "Deleting..." : "Delete Training"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
