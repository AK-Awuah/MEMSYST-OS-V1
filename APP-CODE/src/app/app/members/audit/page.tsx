"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getMembershipAuditService } from "@/lib/services"
import type { MembershipAuditLog } from "@/types"

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
    member_created: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    member_approved: "bg-green-500/15 text-green-400 border-green-500/30",
    member_rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    member_suspended: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    member_activated: "bg-green-600/15 text-green-500 border-green-600/30",
    member_renewed: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    member_updated: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  }
  const c = colors[action] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>{action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
}

export default function MembershipAuditPage() {
  const [logs, setLogs] = useState<MembershipAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMembershipAuditService()
        const data = await svc.listEvents("tenant-1")
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

  const columns: Column<MembershipAuditLog>[] = [
    { key: "action", header: "Action", render: (l) => <AuditActionBadge action={l.action} /> },
    { key: "actor", header: "Actor" },
    { key: "recordType", header: "Record Type", render: (l) => <span className="capitalize">{l.recordType}</span> },
    { key: "recordId", header: "Record ID", render: (l) => <span className="font-mono text-xs text-[#3CA4F9]">{l.recordId}</span> },
    { key: "previousValue", header: "Previous", render: (l) => <span className="text-gray-500">{l.previousValue || "-"}</span> },
    { key: "newValue", header: "New", render: (l) => <span className="text-gray-300">{l.newValue || "-"}</span> },
    { key: "createdAt", header: "Date", render: (l) => <span className="text-gray-400">{new Date(l.createdAt).toLocaleString()}</span> },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Membership Audit"
          description="Membership activity and change history"
          actions={
            <Link
              href="/app/members"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Link>
          }
        />
      </motion.div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={logs} isLoading={loading} emptyMessage="No audit logs found." />
      </motion.div>
    </motion.div>
  )
}
