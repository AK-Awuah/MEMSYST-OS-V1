"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  SUPPORT_HUB_AUDIT_ACTIONS,
  SUPPORT_HUB_AUDIT_ACTION_LABELS,
} from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { SupportHubAuditLog, SupportHubAuditAction } from "@/types"

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
    loan_created: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    loan_approved: "bg-green-500/15 text-green-400 border-green-500/30",
    loan_disbursed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    loan_repaid: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    loan_defaulted: "bg-red-500/15 text-red-400 border-red-500/30",
    scholarship_created: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    scholarship_awarded: "bg-green-600/15 text-green-500 border-green-600/30",
    scholarship_closed: "bg-gray-700/30 text-gray-500 border-gray-600/40",
    sponsorship_created: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    sponsorship_fulfilled: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    program_created: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    program_enrolled: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    program_completed: "bg-green-500/15 text-green-400 border-green-500/30",
    resource_added: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    resource_updated: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    resource_archived: "bg-gray-700/30 text-gray-500 border-gray-600/40",
  }
  const c = colors[action] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = SUPPORT_HUB_AUDIT_ACTION_LABELS[action as SupportHubAuditAction] || action.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function SupportHubAuditPage() {
  const [logs, setLogs] = useState<SupportHubAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.getAuditLogs("tenant-1")
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

  const filtered = useMemo(() => {
    let result = logs
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((l) => l.actor.toLowerCase().includes(s) || l.details?.toLowerCase().includes(s))
    }
    if (actionFilter !== "all") {
      result = result.filter((l) => l.action === actionFilter)
    }
    return result
  }, [search, actionFilter, logs])

  const columns: Column<SupportHubAuditLog>[] = [
    {
      key: "action",
      header: "Action",
      render: (l) => <AuditActionBadge action={l.action} />,
    },
    {
      key: "actor",
      header: "Actor",
      render: (l) => <span className="font-medium text-white">{l.actor}</span>,
    },
    {
      key: "recordType",
      header: "Record Type",
      render: (l) => <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">{l.recordType}</span>,
    },
    {
      key: "recordId",
      header: "Record ID",
      render: (l) => <span className="font-mono text-xs text-[#3CA4F9]">{l.recordId}</span>,
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
        <PageHeader title="Support Hub Audit" description="Loading audit logs..." />
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Support Hub Audit" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Support Hub Audit"
          description="Support hub activity and audit logs"
          actions={
            <Link
              href="/app/support-hub"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Support Hub
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
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
          {SUPPORT_HUB_AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>{SUPPORT_HUB_AUDIT_ACTION_LABELS[a]}</option>
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
