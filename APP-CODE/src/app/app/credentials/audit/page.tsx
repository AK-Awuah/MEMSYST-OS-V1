"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { CREDENTIAL_AUDIT_ACTIONS, CREDENTIAL_AUDIT_ACTION_LABELS } from "@/lib/constants"
import { getCredentialAuditService } from "@/lib/services"
import type { CredentialAuditLog, CredentialAuditAction } from "@/types"

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
    credential_generated: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    credential_printed: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    credential_ordered: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    credential_reprinted: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    credential_cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
    credential_verified: "bg-green-500/15 text-green-400 border-green-500/30",
    credential_expired: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  }
  const c = colors[action] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = CREDENTIAL_AUDIT_ACTION_LABELS[action as CredentialAuditAction] || action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>{label}</span>
  )
}

export default function AuditPage() {
  const [logs, setLogs] = useState<CredentialAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCredentialAuditService()
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

  const filtered = useMemo(() => {
    if (actionFilter === "all") return logs
    return logs.filter((l) => l.action === actionFilter)
  }, [actionFilter, logs])

  const columns: Column<CredentialAuditLog>[] = [
    {
      key: "createdAt",
      header: "Timestamp",
      render: (l) => (
        <span className="text-gray-400 text-xs">
          {new Date(l.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actor",
      header: "Actor",
      render: (l) => <span className="text-white">{l.actor}</span>,
    },
    {
      key: "action",
      header: "Action",
      render: (l) => <AuditActionBadge action={l.action} />,
    },
    {
      key: "credentialType",
      header: "Credential Type",
      render: (l) => (
        <span className="text-gray-300 capitalize">{l.credentialType === "id_card" ? "ID Card" : "Certificate"}</span>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (l) => <span className="text-gray-400 text-xs max-w-[200px] truncate block">{l.details || "-"}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credential Audit Log" description="Compliance and activity logs" />
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credential Audit Log" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Credential Audit Log"
          description="Compliance and activity logs for all credential operations"
          actions={
            <Link
              href="/app/credentials"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Actions</option>
          {CREDENTIAL_AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>{CREDENTIAL_AUDIT_ACTION_LABELS[a]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} emptyMessage="No audit logs found." />
      </motion.div>
    </motion.div>
  )
}
