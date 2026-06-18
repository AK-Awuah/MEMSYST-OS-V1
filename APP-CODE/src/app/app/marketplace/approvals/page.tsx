"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Check, X, Edit3 } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getMarketplaceApprovalService } from "@/lib/services"
import type { MarketplaceApproval } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/15 text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  changes_requested: "bg-blue-500/15 text-blue-400 border-blue-500/30",
}

const listingTypeLabels: Record<string, string> = {
  listing: "Listing",
  business: "Business",
  opportunity: "Opportunity",
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<MarketplaceApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [reasonPrompt, setReasonPrompt] = useState<{ id: string; action: "reject" | "changes_requested" } | null>(null)
  const [reason, setReason] = useState("")

  const fetch = async () => {
    try {
      setLoading(true)
      const svc = await getMarketplaceApprovalService()
      const data = await svc.listPendingApprovals("tenant-1")
      setApprovals(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load approvals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const filtered = useMemo(() => {
    if (statusFilter === "all") return approvals
    return approvals.filter((a) => a.status === statusFilter)
  }, [statusFilter, approvals])

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id)
      const svc = await getMarketplaceApprovalService()
      await svc.approveListing(id, "admin", "Admin")
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!reasonPrompt) return
    try {
      setActionLoading(reasonPrompt.id)
      const svc = await getMarketplaceApprovalService()
      await svc.rejectListing(reasonPrompt.id, "admin", "Admin", reason)
      setReasonPrompt(null)
      setReason("")
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reject")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRequestChanges = async () => {
    if (!reasonPrompt) return
    try {
      setActionLoading(reasonPrompt.id)
      const svc = await getMarketplaceApprovalService()
      await svc.requestChanges(reasonPrompt.id, "admin", "Admin", reason)
      setReasonPrompt(null)
      setReason("")
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to request changes")
    } finally {
      setActionLoading(null)
    }
  }

  const columns: Column<MarketplaceApproval>[] = [
    { key: "listingId", header: "Listing ID", render: (a) => <span className="text-white font-mono text-xs">{a.listingId}</span> },
    {
      key: "listingType", header: "Type", render: (a) => (
        <span className="inline-block rounded-full border border-[#1e3a5f] px-2.5 py-0.5 text-xs font-medium text-gray-300">{listingTypeLabels[a.listingType] || a.listingType}</span>
      ),
    },
    {
      key: "status", header: "Status", render: (a) => {
        const c = statusColors[a.status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
        return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>{a.status.replace(/_/g, " ")}</span>
      },
    },
    {
      key: "createdAt", header: "Created Date", render: (a) => (
        <span className="text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions", header: "", render: (a) => {
        if (a.status !== "pending") return <span className="text-xs text-gray-500">-</span>
        return (
          <div className="flex items-center gap-2">
            <button onClick={() => handleApprove(a.id)} disabled={actionLoading === a.id} className="flex items-center gap-1 rounded bg-green-500/20 px-2.5 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/30 disabled:opacity-50">
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button onClick={() => setReasonPrompt({ id: a.id, action: "reject" })} disabled={actionLoading === a.id} className="flex items-center gap-1 rounded bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30 disabled:opacity-50">
              <X className="h-3.5 w-3.5" /> Reject
            </button>
            <button onClick={() => setReasonPrompt({ id: a.id, action: "changes_requested" })} disabled={actionLoading === a.id} className="flex items-center gap-1 rounded bg-blue-500/20 px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/30 disabled:opacity-50">
              <Edit3 className="h-3.5 w-3.5" /> Changes
            </button>
          </div>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Approval Queue" description="Review and moderate marketplace submissions" />
        <div className="flex items-center justify-center py-16"><p className="text-sm text-gray-500">Loading approvals...</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Approval Queue" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Approval Queue" description="Review and moderate listings, businesses and opportunities" />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="changes_requested">Changes Requested</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} emptyMessage="No approvals found." />
      </motion.div>

      {reasonPrompt && (
        <motion.div variants={itemVariants} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">{reasonPrompt.action === "reject" ? "Reject Listing" : "Request Changes"}</h3>
            <p className="mb-4 text-sm text-gray-400">{reasonPrompt.action === "reject" ? "Provide a reason for rejection." : "Describe what changes are needed."}</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" placeholder="Reason..." />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => { setReasonPrompt(null); setReason("") }} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={reasonPrompt.action === "reject" ? handleReject : handleRequestChanges} disabled={!reason.trim()} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">
                {reasonPrompt.action === "reject" ? "Reject" : "Request Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
