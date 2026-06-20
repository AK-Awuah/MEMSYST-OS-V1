"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, ClipboardCheck, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_STATUS_LABELS,
} from "@/lib/constants"
import { getAttendanceService } from "@/lib/services"
import type { Attendance, AttendanceStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function AttendanceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    present: "bg-green-500/15 text-green-400 border-green-500/30",
    absent: "bg-red-500/15 text-red-400 border-red-500/30",
    late: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    excused: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = ATTENDANCE_STATUS_LABELS[status as AttendanceStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function AttendancePage() {
  const router = useRouter()
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAttendanceService()
        const data = await svc.listAttendance("tenant-1")
        if (!cancelled) setRecords(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load attendance records")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
  }), [records])

  const filtered = useMemo(() => {
    let result = records
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((r) => r.learnerName.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter)
    }
    if (courseFilter !== "all") {
      result = result.filter((r) => r.courseId === courseFilter)
    }
    if (dateFilter) {
      result = result.filter((r) => r.date.startsWith(dateFilter))
    }
    return result
  }, [search, statusFilter, courseFilter, dateFilter, records])

  const courseIds = useMemo(() => [...new Set(records.map((r) => r.courseId))], [records])

  const columns: Column<Attendance>[] = [
    {
      key: "learnerName",
      header: "Learner",
      render: (r) => <span className="font-medium text-white">{r.learnerName}</span>,
    },
    {
      key: "session",
      header: "Session",
      render: (r) => <span className="text-gray-300">{r.session}</span>,
    },
    {
      key: "courseId",
      header: "Course",
      render: (r) => <span className="text-gray-400">{r.courseId}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <AttendanceStatusBadge status={r.status} />,
    },
    {
      key: "date",
      header: "Date",
      render: (r) => <span className="text-gray-400">{new Date(r.date).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Attendance" description="Track learner attendance" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard title="Present" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard title="Absent" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard title="Late" value="-" icon={<ClipboardCheck className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading attendance records...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Attendance" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Attendance"
          description="Track learner attendance"
          actions={
            <Link
              href="/app/training/attendance/record"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Record Attendance
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Present" value={stats.present} icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Absent" value={stats.absent} icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard title="Late" value={stats.late} icon={<ClipboardCheck className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by learner name..."
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
          {ATTENDANCE_STATUSES.map((s) => (
            <option key={s} value={s}>{ATTENDANCE_STATUS_LABELS[s]}</option>
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
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No attendance records found."
        />
      </motion.div>
    </motion.div>
  )
}
