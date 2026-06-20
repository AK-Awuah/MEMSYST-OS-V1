"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Building2, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  TRAINING_CENTER_STATUSES,
  TRAINING_CENTER_STATUS_LABELS,
} from "@/lib/constants"
import { getTrainingCenterService } from "@/lib/services"
import type { TrainingCenter, TrainingCenterStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function AccreditationBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-500/15 text-red-400 border-red-500/30",
    expired: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    closed: "bg-gray-700/30 text-gray-500 border-gray-600/40",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = TRAINING_CENTER_STATUS_LABELS[status as TrainingCenterStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function TrainingCentersPage() {
  const router = useRouter()
  const [centers, setCenters] = useState<TrainingCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [accreditationFilter, setAccreditationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTrainingCenterService()
        const data = await svc.listTrainingCenters("tenant-1")
        if (!cancelled) setCenters(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load training centers")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: centers.length,
    active: centers.filter((c) => c.accreditationStatus === "active").length,
    pending: centers.filter((c) => c.accreditationStatus === "pending").length,
  }), [centers])

  const filtered = useMemo(() => {
    let result = centers
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(s) || c.location.toLowerCase().includes(s))
    }
    if (accreditationFilter !== "all") {
      result = result.filter((c) => c.accreditationStatus === accreditationFilter)
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }
    return result
  }, [search, accreditationFilter, statusFilter, centers])

  const columns: Column<TrainingCenter>[] = [
    {
      key: "name",
      header: "Name",
      render: (c) => <span className="font-medium text-white">{c.name}</span>,
    },
    {
      key: "location",
      header: "Location",
      render: (c) => <span className="text-gray-400">{c.location}</span>,
    },
    {
      key: "accreditationStatus",
      header: "Accreditation Status",
      render: (c) => <AccreditationBadge status={c.accreditationStatus} />,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
          c.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"
        }`}>
          {c.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "ownerName",
      header: "Owner",
      render: (c) => <span className="text-gray-400">{c.ownerName}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Centers" description="Manage all training centers" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total" value="-" icon={<Building2 className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Building2 className="h-5 w-5" />} />
          <StatCard title="Pending" value="-" icon={<Building2 className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading training centers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Centers" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Training Centers"
          description="Manage all training centers"
          actions={
            <Link
              href="/app/training/centers/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Center
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total" value={stats.total} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Pending" value={stats.pending} icon={<Building2 className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search centers by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={accreditationFilter}
          onChange={(e) => setAccreditationFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Accreditation</option>
          {TRAINING_CENTER_STATUSES.map((s) => (
            <option key={s} value={s}>{TRAINING_CENTER_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(c) => router.push(`/app/training/centers/${c.id}`)}
          emptyMessage="No training centers found."
        />
      </motion.div>
    </motion.div>
  )
}
