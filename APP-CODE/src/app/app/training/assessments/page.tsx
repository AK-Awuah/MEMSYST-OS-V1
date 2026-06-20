"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, ClipboardCheck, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  ASSESSMENT_TYPES,
  ASSESSMENT_TYPE_LABELS,
  ASSESSMENT_RESULTS,
  ASSESSMENT_RESULT_LABELS,
} from "@/lib/constants"
import { getAssessmentService } from "@/lib/services"
import type { Assessment, AssessmentType, AssessmentResult } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

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

export default function AssessmentsPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAssessmentService()
        const data = await svc.listAssessments("tenant-1")
        if (!cancelled) setAssessments(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load assessments")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: assessments.length,
    passed: assessments.filter((a) => a.result === "pass").length,
    failed: assessments.filter((a) => a.result === "fail").length,
    pending: assessments.filter((a) => a.result === "pending").length,
  }), [assessments])

  const filtered = useMemo(() => {
    let result = assessments
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((a) => a.learnerName.toLowerCase().includes(s) || a.courseId.toLowerCase().includes(s))
    }
    if (typeFilter !== "all") result = result.filter((a) => a.assessmentType === typeFilter)
    if (resultFilter !== "all") result = result.filter((a) => a.result === resultFilter)
    return result
  }, [search, typeFilter, resultFilter, assessments])

  const columns: Column<Assessment>[] = [
    {
      key: "learnerName",
      header: "Learner",
      render: (a) => <span className="font-medium text-white">{a.learnerName}</span>,
    },
    {
      key: "courseId",
      header: "Course",
      render: (a) => <span className="text-gray-400">{a.courseId}</span>,
    },
    {
      key: "assessmentType",
      header: "Type",
      render: (a) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {ASSESSMENT_TYPE_LABELS[a.assessmentType as AssessmentType] || a.assessmentType}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (a) => <span className="text-gray-400">{a.score}/{a.maxScore}</span>,
    },
    {
      key: "result",
      header: "Result",
      render: (a) => <AssessmentResultBadge result={a.result} />,
    },
    {
      key: "date",
      header: "Date",
      render: (a) => <span className="text-gray-400">{new Date(a.date).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Assessments" description="Manage all learner assessments" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard title="Passed" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard title="Failed" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard title="Pending" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading assessments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Assessments" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Assessments"
          description="Manage all learner assessments"
          actions={
            <Link
              href="/app/training/assessments/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Assessment
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Passed" value={stats.passed} icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Failed" value={stats.failed} icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Pending" value={stats.pending} icon={<ClipboardCheck className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by learner or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Types</option>
          {ASSESSMENT_TYPES.map((t) => (
            <option key={t} value={t}>{ASSESSMENT_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Results</option>
          {ASSESSMENT_RESULTS.map((r) => (
            <option key={r} value={r}>{ASSESSMENT_RESULT_LABELS[r]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(a) => router.push(`/app/training/assessments/${a.id}`)}
          emptyMessage="No assessments found."
        />
      </motion.div>
    </motion.div>
  )
}
