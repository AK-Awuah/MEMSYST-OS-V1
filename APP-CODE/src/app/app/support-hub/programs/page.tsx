"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Search, BookOpen } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  SUPPORT_PROGRAM_STATUSES,
  SUPPORT_PROGRAM_STATUS_LABELS,
  SUPPORT_PROGRAM_CATEGORIES,
  SUPPORT_PROGRAM_CATEGORY_LABELS,
} from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { SupportProgram, SupportProgramStatus, SupportProgramCategory } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function ProgramStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = SUPPORT_PROGRAM_STATUS_LABELS[status as SupportProgramStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function ProgramsPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<SupportProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.listPrograms("tenant-1")
        if (!cancelled) setPrograms(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load programs")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: programs.length,
    active: programs.filter((p) => p.status === "active").length,
    completed: programs.filter((p) => p.status === "completed").length,
  }), [programs])

  const filtered = useMemo(() => {
    let result = programs
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q))
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter)
    }
    return result
  }, [search, statusFilter, categoryFilter, programs])

  const columns: Column<SupportProgram>[] = [
    {
      key: "title",
      header: "Title",
      render: (p) => <span className="font-medium text-white">{p.title}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {SUPPORT_PROGRAM_CATEGORY_LABELS[p.category as SupportProgramCategory] || p.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <ProgramStatusBadge status={p.status} />,
    },
    {
      key: "budget",
      header: "Budget",
      render: (p) => <span className="text-gray-400">${p.budget.toLocaleString()}</span>,
    },
    {
      key: "currentBeneficiaries",
      header: "Beneficiaries",
      render: (p) => <span className="text-gray-400">{p.currentBeneficiaries} / {p.maxBeneficiaries}</span>,
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (p) => <span className="text-gray-400">{new Date(p.startDate).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Support Programs" description="Manage support programs and initiatives" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Completed" value="-" icon={<BookOpen className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading programs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Support Programs" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Support Programs"
          description="Manage support programs and initiatives"
          actions={
            <Link
              href="/app/support-hub/programs/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Program
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Completed" value={stats.completed} icon={<BookOpen className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or provider..."
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
          {SUPPORT_PROGRAM_STATUSES.map((s) => (
            <option key={s} value={s}>{SUPPORT_PROGRAM_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Categories</option>
          {SUPPORT_PROGRAM_CATEGORIES.map((c) => (
            <option key={c} value={c}>{SUPPORT_PROGRAM_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(p) => router.push(`/app/support-hub/programs/${p.id}`)}
          emptyMessage="No programs found."
        />
      </motion.div>
    </motion.div>
  )
}
