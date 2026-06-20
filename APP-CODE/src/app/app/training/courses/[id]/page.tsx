"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Archive, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  COURSE_STATUS_LABELS,
} from "@/lib/constants"
import { getCourseService } from "@/lib/services"
import type { Course, CourseStatus } from "@/types"

function CourseStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    published: "bg-green-500/15 text-green-400 border-green-500/30",
    archived: "bg-gray-700/30 text-gray-500 border-gray-600/40",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = COURSE_STATUS_LABELS[status as CourseStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchCourse = async () => {
    try {
      const svc = await getCourseService()
      const data = await svc.getCourse(id)
      setCourse(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load course")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCourseService()
        const data = await svc.getCourse(id)
        if (!cancelled) setCourse(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load course")
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
      await fetchCourse()
    } catch (e) {
      alert(e instanceof Error ? e.message : `Failed to ${action} course`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getCourseService()
      await svc.deleteCourse(id)
      router.push("/app/training/courses")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete course")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading course...</p>
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

  if (!course) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Course not found.</div>
      </div>
    )
  }

  const isDraft = course.status === "draft"
  const isPublished = course.status === "published"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </button>

      <PageHeader
        title={course.title}
        description={`Level: ${course.level} — Status: ${COURSE_STATUS_LABELS[course.status as CourseStatus] || course.status}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Title</p>
                <p className="text-sm font-medium text-white mt-1">{course.title}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><CourseStatusBadge status={course.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Level</p>
                <p className="text-sm font-medium text-white mt-1">{course.level}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-white mt-1">{course.duration}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Fees</p>
                <p className="text-sm font-medium text-white mt-1">{course.fees > 0 ? `$${course.fees}` : "Free"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Program ID</p>
                <p className="text-sm font-medium text-white mt-1">{course.programId || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Updated At</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(course.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{course.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {isDraft && (
                <button
                  onClick={() => handleAction("publish", async () => {
                    const svc = await getCourseService()
                    await svc.publishCourse(id)
                  })}
                  disabled={actionLoading === "publish"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {actionLoading === "publish" ? "Publishing..." : "Publish Course"}
                </button>
              )}
              {isPublished && (
                <button
                  onClick={() => handleAction("archive", async () => {
                    const svc = await getCourseService()
                    await svc.archiveCourse(id)
                  })}
                  disabled={actionLoading === "archive"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "archive" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  {actionLoading === "archive" ? "Archiving..." : "Archive Course"}
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
