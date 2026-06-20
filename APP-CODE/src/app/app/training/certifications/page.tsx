"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  TRAINING_CERTIFICATION_TYPES,
  TRAINING_CERTIFICATION_TYPE_LABELS,
  TRAINING_CERTIFICATION_STATUSES,
  TRAINING_CERTIFICATION_STATUS_LABELS,
} from "@/lib/constants"
import { getTrainingCertificationService } from "@/lib/services"
import type { TrainingCertification, TrainingCertificationType, TrainingCertificationStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function CertStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    expired: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    revoked: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = TRAINING_CERTIFICATION_STATUS_LABELS[status as TrainingCertificationStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<TrainingCertification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTrainingCertificationService()
        const data = await svc.listCertifications("tenant-1")
        if (!cancelled) setCertifications(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load certifications")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: certifications.length,
    active: certifications.filter((c) => c.status === "active").length,
    expired: certifications.filter((c) => c.status === "expired").length,
    revoked: certifications.filter((c) => c.status === "revoked").length,
  }), [certifications])

  const filtered = useMemo(() => {
    let result = certifications
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((c) => c.learnerName.toLowerCase().includes(s) || c.type.toLowerCase().includes(s))
    }
    if (typeFilter !== "all") result = result.filter((c) => c.type === typeFilter)
    if (statusFilter !== "all") result = result.filter((c) => c.status === statusFilter)
    return result
  }, [search, typeFilter, statusFilter, certifications])

  const columns: Column<TrainingCertification>[] = [
    {
      key: "learnerName",
      header: "Learner",
      render: (c) => <span className="font-medium text-white">{c.learnerName}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {TRAINING_CERTIFICATION_TYPE_LABELS[c.type as TrainingCertificationType] || c.type.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <CertStatusBadge status={c.status} />,
    },
    {
      key: "issuedAt",
      header: "Issued Date",
      render: (c) => <span className="text-gray-400">{new Date(c.issuedAt).toLocaleDateString()}</span>,
    },
    {
      key: "expiresAt",
      header: "Expires",
      render: (c) => <span className="text-gray-400">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "-"}</span>,
    },
    {
      key: "courseId",
      header: "Course",
      render: (c) => <span className="text-gray-400">{c.courseId || "-"}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Certifications" description="Manage issued certifications" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<Award className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Award className="h-5 w-5" />} />
          <StatCard title="Expired" value="-" icon={<Award className="h-5 w-5" />} />
          <StatCard title="Revoked" value="-" icon={<Award className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading certifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Certifications" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Training Certifications" description="Manage issued certifications" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Expired" value={stats.expired} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Revoked" value={stats.revoked} icon={<Award className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by learner or type..."
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
          {TRAINING_CERTIFICATION_TYPES.map((t) => (
            <option key={t} value={t}>{TRAINING_CERTIFICATION_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {TRAINING_CERTIFICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{TRAINING_CERTIFICATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No certifications found."
        />
      </motion.div>
    </motion.div>
  )
}
