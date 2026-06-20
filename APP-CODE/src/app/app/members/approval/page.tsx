"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, XCircle, ArrowLeft, Loader2, Search } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getMemberApprovalService } from "@/lib/services"
import type { ApprovalRecord } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MemberApprovalPage() {
  const [records, setRecords] = useState<ApprovalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMemberApprovalService()
        const data = await svc.listPendingApprovals("tenant-1")
        if (!cancelled) setRecords(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load approvals")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleApprove = async (recordId: string) => {
    setApproving(recordId)
    try {
      const svc = await getMemberApprovalService()
      await svc.approveStage(recordId, 1, "admin-1", "Approved")
      setRecords((prev) => prev.filter((r) => r.id !== recordId))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed")
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (recordId: string) => {
    setApproving(recordId)
    try {
      const svc = await getMemberApprovalService()
      await svc.rejectStage(recordId, 1, "admin-1", "Rejected")
      setRecords((prev) => prev.filter((r) => r.id !== recordId))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rejection failed")
    } finally {
      setApproving(null)
    }
  }

  const columns: Column<ApprovalRecord>[] = [
    { key: "memberId", header: "Member ID", render: (r) => <span className="font-mono text-xs text-[#3CA4F9]">{r.memberId}</span> },
    { key: "approverLevel", header: "Level", render: (r) => <span className="capitalize">{r.stages[0]?.approverLevel || "N/A"}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => handleApprove(r.id)} disabled={approving === r.id} className="inline-flex items-center gap-1 rounded-md bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/30 disabled:opacity-50">
          {approving === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
          Approve
        </button>
        <button onClick={() => handleReject(r.id)} disabled={approving === r.id} className="inline-flex items-center gap-1 rounded-md bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50">
          <XCircle className="h-3 w-3" />
          Reject
        </button>
      </div>
    )},
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Member Approvals"
          description="Review and process pending member approvals"
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
        <DataTable
          columns={columns}
          data={records}
          isLoading={loading}
          emptyMessage="No pending approvals."
        />
      </motion.div>
    </motion.div>
  )
}
