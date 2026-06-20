"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Briefcase } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  APPRENTICESHIP_TRAINING_STATUSES,
  APPRENTICESHIP_TRAINING_STATUS_LABELS,
} from "@/lib/constants"
import { getApprenticeshipTrainingService } from "@/lib/services"
import type { ApprenticeshipTraining, ApprenticeshipTrainingStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function TrainingStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    registered: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    under_assessment: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    completed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    graduated: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    upgraded: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = APPRENTICESHIP_TRAINING_STATUS_LABELS[status as ApprenticeshipTrainingStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#1e3a5f] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3CA4F9] to-green-400 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{value}%</span>
    </div>
  )
}

export default function ApprenticeshipsPage() {
  const router = useRouter()
  const [trainings, setTrainings] = useState<ApprenticeshipTraining[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getApprenticeshipTrainingService()
        const data = await svc.listApprenticeshipTrainings("tenant-1")
        if (!cancelled) setTrainings(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load apprenticeship trainings")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: trainings.length,
    active: trainings.filter((t) => t.status === "active").length,
    registered: trainings.filter((t) => t.status === "registered").length,
    completed: trainings.filter((t) => t.status === "completed" || t.status === "graduated").length,
  }), [trainings])

  const filtered = useMemo(() => {
    let result = trainings
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((t) => t.apprenticeName.toLowerCase().includes(s) || t.mentorName.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter)
    }
    return result
  }, [search, statusFilter, trainings])

  const columns: Column<ApprenticeshipTraining>[] = [
    {
      key: "apprenticeName",
      header: "Apprentice",
      render: (t) => <span className="font-medium text-white">{t.apprenticeName}</span>,
    },
    {
      key: "mentorName",
      header: "Mentor",
      render: (t) => <span className="text-gray-300">{t.mentorName}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <TrainingStatusBadge status={t.status} />,
    },
    {
      key: "progress",
      header: "Progress",
      render: (t) => <ProgressBar value={t.progress} />,
    },
    {
      key: "skillsAcquired",
      header: "Skills",
      render: (t) => <span className="text-gray-400">{t.skillsAcquired.length}</span>,
    },
    {
      key: "startDate",
      header: "Started",
      render: (t) => <span className="text-gray-400">{new Date(t.startDate).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Apprenticeship Training" description="Manage apprenticeship training records" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<Briefcase className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Briefcase className="h-5 w-5" />} />
          <StatCard title="Registered" value="-" icon={<Briefcase className="h-5 w-5" />} />
          <StatCard title="Completed" value="-" icon={<Briefcase className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading apprenticeship trainings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Apprenticeship Training" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Apprenticeship Training"
          description="Manage apprenticeship training records"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Registered" value={stats.registered} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Completed/Graduated" value={stats.completed} icon={<Briefcase className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by apprentice or mentor..."
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
          {APPRENTICESHIP_TRAINING_STATUSES.map((s) => (
            <option key={s} value={s}>{APPRENTICESHIP_TRAINING_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(t) => router.push(`/app/training/apprenticeships/${t.id}`)}
          emptyMessage="No apprenticeship trainings found."
        />
      </motion.div>
    </motion.div>
  )
}
