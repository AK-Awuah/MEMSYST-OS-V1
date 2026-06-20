"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  ASSESSMENT_TYPE_LABELS,
  ASSESSMENT_RESULT_LABELS,
} from "@/lib/constants"
import { getAssessmentService } from "@/lib/services"
import type { Assessment, AssessmentType, AssessmentResult } from "@/types"

function AssessmentResultBadge({ result }: { result: string }) {
  const colors: Record<string, string> = {
    pass: "bg-green-500/15 text-green-400 border-green-500/30",
    fail: "bg-red-500/15 text-red-400 border-red-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  }
  const c = colors[result] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = ASSESSMENT_RESULT_LABELS[result as AssessmentResult] || result
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchAssessment = async () => {
    try {
      const svc = await getAssessmentService()
      const data = await svc.getAssessment(id)
      setAssessment(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load assessment")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAssessmentService()
        const data = await svc.getAssessment(id)
        if (!cancelled) setAssessment(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load assessment")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this assessment? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getAssessmentService()
      await svc.deleteAssessment(id)
      router.push("/app/training/assessments")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete assessment")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading assessment...</p>
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

  if (!assessment) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Assessment not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Assessments
      </button>

      <PageHeader
        title={`${assessment.learnerName} - ${assessment.courseId}`}
        description={`Assessment on ${new Date(assessment.date).toLocaleDateString()}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Assessment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Learner</p>
                <p className="text-sm font-medium text-white mt-1">{assessment.learnerName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Course</p>
                <p className="text-sm font-medium text-white mt-1">{assessment.courseId}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">
                  {ASSESSMENT_TYPE_LABELS[assessment.assessmentType as AssessmentType] || assessment.assessmentType}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Result</p>
                <div className="mt-1"><AssessmentResultBadge result={assessment.result} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-sm font-medium text-white mt-1">{assessment.score} / {assessment.maxScore}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(assessment.date).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Learner ID</p>
                <p className="text-sm font-medium text-white mt-1">{assessment.learnerId}</p>
              </div>
            </div>
          </div>

          {assessment.notes && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Notes</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{assessment.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
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
