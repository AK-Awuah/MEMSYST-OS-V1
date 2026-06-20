"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  SUPPORT_PROGRAM_STATUS_LABELS,
  SUPPORT_PROGRAM_CATEGORY_LABELS,
} from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { SupportProgram, SupportProgramCategory, SupportProgramStatus, SupportProgramEnrollment } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [program, setProgram] = useState<SupportProgram | null>(null)
  const [enrollments, setEnrollments] = useState<SupportProgramEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [memberName, setMemberName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const svc = await getSupportHubService()
      const [p, enrs] = await Promise.all([
        svc.getProgram(id),
        svc.listEnrollments(id),
      ])
      setProgram(p)
      setEnrollments(enrs)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load program")
    }
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const [p, enrs] = await Promise.all([
          svc.getProgram(id),
          svc.listEnrollments(id),
        ])
        if (!cancelled) { setProgram(p); setEnrollments(enrs) }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load program")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleAddEnrollment = async () => {
    if (!memberId || !memberName) return
    setSubmitting(true)
    try {
      const svc = await getSupportHubService()
      await svc.createEnrollment({
        programId: id,
        tenantId: "tenant-1",
        memberId,
        memberName,
        enrollmentDate: new Date().toISOString(),
        status: "pending",
        benefitsReceived: [],
      })
      setMemberId("")
      setMemberName("")
      setShowEnrollForm(false)
      await fetchData()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to add enrollment")
    } finally {
      setSubmitting(false)
    }
  }

  const enrollmentColumns: Column<SupportProgramEnrollment>[] = [
    {
      key: "memberId",
      header: "Member ID",
      render: (e) => <span className="font-medium text-white">{e.memberId}</span>,
    },
    {
      key: "memberName",
      header: "Name",
      render: (e) => <span className="text-gray-400">{e.memberName}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: "enrollmentDate",
      header: "Enrolled Date",
      render: (e) => <span className="text-gray-400">{new Date(e.enrollmentDate).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading program...</p>
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

  if (!program) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Program not found.</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Programs
        </button>

        <PageHeader
          title={program.title}
          description={`Provider: ${program.provider} — ${SUPPORT_PROGRAM_CATEGORY_LABELS[program.category as SupportProgramCategory] || program.category} — ${SUPPORT_PROGRAM_STATUS_LABELS[program.status as SupportProgramStatus] || program.status}`}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">Program Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Provider</p>
              <p className="text-sm font-medium text-white mt-1">{program.provider}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-medium text-white mt-1">
                {SUPPORT_PROGRAM_CATEGORY_LABELS[program.category as SupportProgramCategory] || program.category}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Status</p>
              <div className="mt-1"><StatusBadge status={program.status} /></div>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Funding Source</p>
              <p className="text-sm font-medium text-white mt-1">{program.fundingSource || "-"}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Budget</p>
              <p className="text-sm font-medium text-white mt-1">${program.budget.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Budget Spent</p>
              <p className="text-sm font-medium text-white mt-1">${program.budgetSpent.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Beneficiaries</p>
              <p className="text-sm font-medium text-white mt-1">{program.currentBeneficiaries} / {program.maxBeneficiaries}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium text-white mt-1">{new Date(program.startDate).toLocaleDateString()}</p>
            </div>
            {program.endDate && (
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(program.endDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{program.description || "No description provided."}</p>
          </div>

          {program.eligibilityCriteria.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Eligibility Criteria</h3>
              <ul className="list-disc list-inside space-y-1">
                {program.eligibilityCriteria.map((c, i) => (
                  <li key={i} className="text-sm text-gray-300">{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Application Process</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{program.applicationProcess || "No application process specified."}</p>
          </div>

          {program.benefits.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Benefits</h3>
              <ul className="list-disc list-inside space-y-1">
                {program.benefits.map((b, i) => (
                  <li key={i} className="text-sm text-gray-300">{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Enrollments</h3>
          <button
            onClick={() => setShowEnrollForm(!showEnrollForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Enrollment
          </button>
        </div>

        {showEnrollForm && (
          <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42]/50 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Member ID</label>
                <input
                  type="text"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="mem-123"
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Member Name</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddEnrollment}
                  disabled={submitting || !memberId || !memberName}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  {submitting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        <DataTable
          columns={enrollmentColumns}
          data={enrollments}
          emptyMessage="No enrollments yet."
        />
      </motion.div>
    </motion.div>
  )
}
