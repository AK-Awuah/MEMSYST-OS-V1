"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, CalendarCheck, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  EXAMINATION_STATUSES,
  EXAMINATION_STATUS_LABELS,
} from "@/lib/constants"
import { getExaminationService } from "@/lib/services"
import type { Examination, ExaminationStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

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

export default function ExaminationsPage() {
  const router = useRouter()
  const [exams, setExams] = useState<Examination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getExaminationService()
        const data = await svc.listExaminations("tenant-1")
        if (!cancelled) setExams(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load examinations")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: exams.length,
    scheduled: exams.filter((e) => e.status === "scheduled").length,
    open: exams.filter((e) => e.status === "open").length,
    closed: exams.filter((e) => e.status === "closed").length,
    published: exams.filter((e) => e.status === "published").length,
  }), [exams])

  const filtered = useMemo(() => {
    let result = exams
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((e) => e.title.toLowerCase().includes(s) || e.courseId.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") result = result.filter((e) => e.status === statusFilter)
    return result
  }, [search, statusFilter, exams])

  const columns: Column<Examination>[] = [
    {
      key: "title",
      header: "Title",
      render: (e) => <span className="font-medium text-white">{e.title}</span>,
    },
    {
      key: "courseId",
      header: "Course",
      render: (e) => <span className="text-gray-400">{e.courseId}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (e) => <ExamStatusBadge status={e.status} />,
    },
    {
      key: "scheduledDate",
      header: "Scheduled Date",
      render: (e) => <span className="text-gray-400">{new Date(e.scheduledDate).toLocaleDateString()}</span>,
    },
    {
      key: "duration",
      header: "Duration",
      render: (e) => <span className="text-gray-400">{e.duration}</span>,
    },
    {
      key: "registeredCandidates",
      header: "Candidates",
      render: (e) => <span className="text-gray-400">{e.registeredCandidates}</span>,
    },
    {
      key: "resultsPublished",
      header: "Results",
      render: (e) => (
        <span className={`text-xs ${e.resultsPublished ? "text-green-400" : "text-yellow-400"}`}>
          {e.resultsPublished ? "Published" : "Pending"}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Examinations" description="Manage all examinations" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total" value="-" icon={<CalendarCheck className="h-5 w-5" />} />
          <StatCard title="Scheduled" value="-" icon={<CalendarCheck className="h-5 w-5" />} />
          <StatCard title="Open" value="-" icon={<CalendarCheck className="h-5 w-5" />} />
          <StatCard title="Closed" value="-" icon={<CalendarCheck className="h-5 w-5" />} />
          <StatCard title="Published" value="-" icon={<CalendarCheck className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading examinations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Examinations" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Examinations"
          description="Manage all examinations"
          actions={
            <Link
              href="/app/training/examinations/schedule"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Schedule Exam
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total" value={stats.total} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard title="Scheduled" value={stats.scheduled} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard title="Open" value={stats.open} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard title="Closed" value={stats.closed} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard title="Published" value={stats.published} icon={<CalendarCheck className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {EXAMINATION_STATUSES.map((s) => (
            <option key={s} value={s}>{EXAMINATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(e) => router.push(`/app/training/examinations/${e.id}`)}
          emptyMessage="No examinations found."
        />
      </motion.div>
    </motion.div>
  )
}
