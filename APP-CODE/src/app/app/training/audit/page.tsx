"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { ClipboardList, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  TRAINING_AUDIT_ACTIONS,
  TRAINING_AUDIT_ACTION_LABELS,
} from "@/lib/constants"
import { getTrainingAuditService } from "@/lib/services"
import type { TrainingAuditLog, TrainingAuditAction } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function AuditActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    course_created: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    course_updated: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    course_published: "bg-green-500/15 text-green-400 border-green-500/30",
    course_archived: "bg-gray-700/30 text-gray-500 border-gray-600/40",
    enrollment_approved: "bg-green-500/15 text-green-400 border-green-500/30",
    enrollment_withdrawn: "bg-red-500/15 text-red-400 border-red-500/30",
    attendance_recorded: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    assessment_completed: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    certification_issued: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    graduation_approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    center_created: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    center_approved: "bg-green-500/15 text-green-400 border-green-500/30",
    center_suspended: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  }
  const c = colors[action] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = TRAINING_AUDIT_ACTION_LABELS[action as TrainingAuditAction] || action.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function TrainingAuditPage() {
  const [logs, setLogs] = useState<TrainingAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [recordTypeFilter, setRecordTypeFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTrainingAuditService()
        const data = await svc.listAuditLogs("tenant-1")
        if (!cancelled) setLogs(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load audit logs")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const recordTypes = useMemo(() => {
    const set = new Set(logs.map((l) => l.recordType))
    return Array.from(set)
  }, [logs])

  const filtered = useMemo(() => {
    let result = logs
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((l) => l.actor.toLowerCase().includes(s) || l.details?.toLowerCase().includes(s))
    }
    if (actionFilter !== "all") {
      result = result.filter((l) => l.action === actionFilter)
    }
    if (recordTypeFilter !== "all") {
      result = result.filter((l) => l.recordType === recordTypeFilter)
    }
    return result
  }, [search, actionFilter, recordTypeFilter, logs])

  const columns: Column<TrainingAuditLog>[] = [
    {
      key: "actor",
      header: "Actor",
      render: (l) => <span className="font-medium text-white">{l.actor}</span>,
    },
    {
      key: "action",
      header: "Action",
      render: (l) => <AuditActionBadge action={l.action} />,
    },
    {
      key: "recordType",
      header: "Record Type",
      render: (l) => <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">{l.recordType}</span>,
    },
    {
      key: "details",
      header: "Details",
      render: (l) => <span className="text-gray-400 text-sm max-w-[200px] truncate block">{l.details || "-"}</span>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (l) => <span className="text-gray-400">{new Date(l.createdAt).toLocaleString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Audit" description="Training activity logs" />
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Audit" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Training Audit"
          description="Training activity and audit logs"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by actor or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Actions</option>
          {TRAINING_AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>{TRAINING_AUDIT_ACTION_LABELS[a]}</option>
          ))}
        </select>
        <select
          value={recordTypeFilter}
          onChange={(e) => setRecordTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Record Types</option>
          {recordTypes.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No audit logs found."
        />
      </motion.div>
    </motion.div>
  )
}
