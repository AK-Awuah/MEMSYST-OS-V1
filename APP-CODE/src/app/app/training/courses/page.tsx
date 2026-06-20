"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, BookOpen, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  COURSE_STATUSES,
  COURSE_STATUS_LABELS,
} from "@/lib/constants"
import { getCourseService } from "@/lib/services"
import type { Course, CourseStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

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

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCourseService()
        const data = await svc.listCourses("tenant-1")
        if (!cancelled) setCourses(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load courses")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: courses.length,
    published: courses.filter((c) => c.status === "published").length,
    draft: courses.filter((c) => c.status === "draft").length,
  }), [courses])

  const levels = useMemo(() => {
    const set = new Set(courses.map((c) => c.level).filter(Boolean))
    return Array.from(set)
  }, [courses])

  const filtered = useMemo(() => {
    let result = courses
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((c) => c.title.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }
    if (levelFilter !== "all") {
      result = result.filter((c) => c.level === levelFilter)
    }
    return result
  }, [search, statusFilter, levelFilter, courses])

  const columns: Column<Course>[] = [
    {
      key: "title",
      header: "Title",
      render: (c) => <span className="font-medium text-white">{c.title}</span>,
    },
    {
      key: "level",
      header: "Level",
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9]">
          {c.level}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <CourseStatusBadge status={c.status} />,
    },
    {
      key: "duration",
      header: "Duration",
      render: (c) => <span className="text-gray-400">{c.duration}</span>,
    },
    {
      key: "fees",
      header: "Fees",
      render: (c) => <span className="text-gray-400">{c.fees > 0 ? `$${c.fees}` : "Free"}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Courses" description="Manage all training courses" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Published" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Draft" value="-" icon={<BookOpen className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Courses" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Courses"
          description="Manage all training courses"
          actions={
            <Link
              href="/app/training/courses/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Course
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Published" value={stats.published} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Draft" value={stats.draft} icon={<BookOpen className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Levels</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {COURSE_STATUSES.map((s) => (
            <option key={s} value={s}>{COURSE_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(c) => router.push(`/app/training/courses/${c.id}`)}
          emptyMessage="No courses found."
        />
      </motion.div>
    </motion.div>
  )
}
