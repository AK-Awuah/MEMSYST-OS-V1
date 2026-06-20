"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  ENROLLMENT_SOURCES,
  ENROLLMENT_SOURCE_LABELS,
} from "@/lib/constants"
import { getEnrollmentService } from "@/lib/services"
import type { EnrollmentSource } from "@/types"

export default function NewEnrollmentPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [learnerId, setLearnerId] = useState("")
  const [learnerName, setLearnerName] = useState("")
  const [courseId, setCourseId] = useState("")
  const [courseName, setCourseName] = useState("")
  const [programId, setProgramId] = useState("")
  const [source, setSource] = useState<EnrollmentSource>("self")

  const handleSubmit = async () => {
    if (!learnerId || !courseId || !learnerName) return
    setSubmitting(true)
    try {
      const svc = await getEnrollmentService()
      await svc.createEnrollment({
        tenantId: "tenant-1",
        learnerId,
        learnerName,
        courseId,
        courseName: courseName || undefined,
        programId: programId || undefined,
        source,
        status: "active",
        enrollmentDate: new Date().toISOString(),
      })
      router.push("/app/training/enrollments")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create enrollment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Enrollments
      </button>

      <PageHeader title="New Enrollment" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Learner ID</label>
            <input
              type="text"
              value={learnerId}
              onChange={(e) => setLearnerId(e.target.value)}
              placeholder="Learner identifier"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Learner Name</label>
            <input
              type="text"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Course ID</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Course identifier"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Course Name (optional)</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Advanced Cardiac Life Support"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Program ID (optional)</label>
            <input
              type="text"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              placeholder="Program identifier"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as EnrollmentSource)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {ENROLLMENT_SOURCES.map((s) => (
                <option key={s} value={s}>{ENROLLMENT_SOURCE_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !learnerId || !learnerName || !courseId}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Enrollment"}
        </button>
      </div>
    </div>
  )
}
