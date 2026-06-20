"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GraduationCap, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  GRADUATION_STATUSES,
  GRADUATION_STATUS_LABELS,
} from "@/lib/constants"
import { getGraduationService } from "@/lib/services"
import type { Graduation, GraduationStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function GraduationStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    approved: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    graduated: "bg-green-500/15 text-green-400 border-green-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = GRADUATION_STATUS_LABELS[status as GraduationStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function GraduationsPage() {
  const router = useRouter()
  const [graduations, setGraduations] = useState<Graduation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGraduationService()
        const data = await svc.listGraduations("tenant-1")
        if (!cancelled) setGraduations(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load graduations")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: graduations.length,
    pending: graduations.filter((g) => g.status === "pending_review").length,
    approved: graduations.filter((g) => g.status === "approved").length,
    graduated: graduations.filter((g) => g.status === "graduated").length,
  }), [graduations])

  const filtered = useMemo(() => {
    let result = graduations
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((g) => g.apprenticeName.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((g) => g.status === statusFilter)
    }
    return result
  }, [search, statusFilter, graduations])

  const columns: Column<Graduation>[] = [
    {
      key: "apprenticeName",
      header: "Apprentice",
      render: (g) => <span className="font-medium text-white">{g.apprenticeName}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (g) => <GraduationStatusBadge status={g.status} />,
    },
    {
      key: "trainingComplete",
      header: "Training",
      render: (g) => <span className={`text-sm ${g.trainingComplete ? "text-green-400" : "text-gray-500"}`}>{g.trainingComplete ? "Yes" : "No"}</span>,
    },
    {
      key: "assessmentComplete",
      header: "Assessment",
      render: (g) => <span className={`text-sm ${g.assessmentComplete ? "text-green-400" : "text-gray-500"}`}>{g.assessmentComplete ? "Yes" : "No"}</span>,
    },
    {
      key: "executiveReviewComplete",
      header: "Exec Review",
      render: (g) => <span className={`text-sm ${g.executiveReviewComplete ? "text-green-400" : "text-gray-500"}`}>{g.executiveReviewComplete ? "Yes" : "No"}</span>,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (g) => <span className="text-gray-400">{new Date(g.createdAt).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Graduations" description="Manage apprentice graduations" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard title="Pending Review" value="-" icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard title="Approved" value="-" icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard title="Graduated" value="-" icon={<GraduationCap className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading graduations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Graduations" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Graduations"
          description="Manage apprentice graduations and approvals"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Pending Review" value={stats.pending} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Approved" value={stats.approved} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Graduated" value={stats.graduated} icon={<GraduationCap className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by apprentice name..."
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
          {GRADUATION_STATUSES.map((s) => (
            <option key={s} value={s}>{GRADUATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(g) => router.push(`/app/training/graduations/${g.id}`)}
          emptyMessage="No graduations found."
        />
      </motion.div>
    </motion.div>
  )
}
