"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Users, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_SOURCE_LABELS,
} from "@/lib/constants"
import { getEnrollmentService } from "@/lib/services"
import type { Enrollment, EnrollmentStatus, EnrollmentSource } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function EnrollmentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    withdrawn: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    failed: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = ENROLLMENT_STATUS_LABELS[status as EnrollmentStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function EnrollmentsPage() {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getEnrollmentService()
        const data = await svc.listEnrollments("tenant-1")
        if (!cancelled) setEnrollments(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load enrollments")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: enrollments.length,
    active: enrollments.filter((e) => e.status === "active").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
  }), [enrollments])

  const filtered = useMemo(() => {
    let result = enrollments
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((e) => e.learnerName.toLowerCase().includes(s) || (e.courseName || "").toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter)
    }
    if (courseFilter !== "all") {
      result = result.filter((e) => e.courseId === courseFilter)
    }
    return result
  }, [search, statusFilter, courseFilter, enrollments])

  const courseIds = useMemo(() => [...new Set(enrollments.map((e) => e.courseId))], [enrollments])

  const columns: Column<Enrollment>[] = [
    {
      key: "learnerName",
      header: "Learner",
      render: (e) => <span className="font-medium text-white">{e.learnerName}</span>,
    },
    {
      key: "courseName",
      header: "Course",
      render: (e) => <span className="text-gray-300">{e.courseName || e.courseId}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (e) => <EnrollmentStatusBadge status={e.status} />,
    },
    {
      key: "source",
      header: "Source",
      render: (e) => (
        <span className="text-gray-400 capitalize">
          {ENROLLMENT_SOURCE_LABELS[e.source as EnrollmentSource] || e.source}
        </span>
      ),
    },
    {
      key: "enrollmentDate",
      header: "Enrolled",
      render: (e) => <span className="text-gray-400">{new Date(e.enrollmentDate).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Enrollments" description="Manage course enrollments" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<Users className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Users className="h-5 w-5" />} />
          <StatCard title="Completed" value="-" icon={<Users className="h-5 w-5" />} />
          <StatCard title="Pending" value="-" icon={<Users className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading enrollments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Enrollments" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Enrollments"
          description="Manage course enrollments"
          actions={
            <Link
              href="/app/training/enrollments/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Enrollment
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Completed" value={stats.completed} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Pending" value={stats.pending} icon={<Users className="h-5 w-5" />} />
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {ENROLLMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{ENROLLMENT_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Courses</option>
          {courseIds.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No enrollments found."
        />
      </motion.div>
    </motion.div>
  )
}
