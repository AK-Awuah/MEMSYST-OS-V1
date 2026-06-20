"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Trash2, Loader2 } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  EXAMINATION_STATUS_LABELS,
} from "@/lib/constants"
import { getExaminationService } from "@/lib/services"
import type { Examination, ExaminationResult, ExaminationStatus } from "@/types"

function ExamStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    open: "bg-green-500/15 text-green-400 border-green-500/30",
    closed: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    published: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = EXAMINATION_STATUS_LABELS[status as ExaminationStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function ExaminationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [exam, setExam] = useState<Examination | null>(null)
  const [results, setResults] = useState<ExaminationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const svc = await getExaminationService()
      const [examData, resultsData] = await Promise.all([
        svc.getExamination(id),
        svc.getResults(id),
      ])
      setExam(examData)
      setResults(resultsData)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load examination")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getExaminationService()
        const [examData, resultsData] = await Promise.all([
          svc.getExamination(id),
          svc.getResults(id),
        ])
        if (!cancelled) {
          setExam(examData)
          setResults(resultsData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load examination")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handlePublishResults = async () => {
    setActionLoading("publish")
    try {
      const svc = await getExaminationService()
      await svc.publishResults(id)
      await fetchData()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to publish results")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this examination? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getExaminationService()
      await svc.deleteExamination(id)
      router.push("/app/training/examinations")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete examination")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading examination...</p>
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

  if (!exam) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Examination not found.</div>
      </div>
    )
  }

  const resultColumns: Column<ExaminationResult>[] = [
    {
      key: "learnerName",
      header: "Learner",
      render: (r) => <span className="font-medium text-white">{r.learnerName}</span>,
    },
    {
      key: "score",
      header: "Score",
      render: (r) => <span className="text-gray-400">{r.score !== undefined ? r.score : "-"}</span>,
    },
    {
      key: "result",
      header: "Result",
      render: (r) => (
        <span className={`text-xs font-medium ${r.result === "pass" ? "text-green-400" : r.result === "fail" ? "text-red-400" : "text-yellow-400"}`}>
          {r.result ? r.result.charAt(0).toUpperCase() + r.result.slice(1) : "-"}
        </span>
      ),
    },
    {
      key: "approved",
      header: "Approved",
      render: (r) => (
        <span className={`text-xs ${r.approved ? "text-green-400" : "text-yellow-400"}`}>
          {r.approved ? "Yes" : "No"}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Examinations
      </button>

      <PageHeader
        title={exam.title}
        description={`Course: ${exam.courseId} — ${new Date(exam.scheduledDate).toLocaleDateString()}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Examination Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><ExamStatusBadge status={exam.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-white mt-1">{exam.duration}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Registered Candidates</p>
                <p className="text-sm font-medium text-white mt-1">{exam.registeredCandidates}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Results Published</p>
                <p className={`text-sm font-medium mt-1 ${exam.resultsPublished ? "text-green-400" : "text-yellow-400"}`}>
                  {exam.resultsPublished ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Scheduled Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(exam.scheduledDate).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(exam.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Results ({results.length})</h3>
            <DataTable
              columns={resultColumns}
              data={results}
              emptyMessage="No results recorded yet."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {!exam.resultsPublished && (
                <button
                  onClick={handlePublishResults}
                  disabled={actionLoading === "publish"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {actionLoading === "publish" ? "Publishing..." : "Publish Results"}
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
