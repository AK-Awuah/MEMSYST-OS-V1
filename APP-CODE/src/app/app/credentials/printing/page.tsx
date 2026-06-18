"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Printer, ArrowLeft, CheckCircle, ThumbsUp, Search } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { PRINT_REQUEST_STATUSES, PRINT_REQUEST_STATUS_LABELS } from "@/lib/constants"
import { getPrintingService } from "@/lib/services"
import type { PrintRequest, PrintRequestStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const statusBadgeVariant: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  approved: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/15 text-gray-400 border-gray-500/30",
}

function PrintStatusBadge({ status }: { status: string }) {
  const colors = statusBadgeVariant[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = PRINT_REQUEST_STATUS_LABELS[status as PrintRequestStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}>
      {label}
    </span>
  )
}

export default function PrintingPage() {
  const [requests, setRequests] = useState<PrintRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getPrintingService()
        const data = await svc.listPrintRequests("tenant-1")
        if (!cancelled) setRequests(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load print requests")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    completed: requests.filter((r) => r.status === "completed").length,
  }), [requests])

  const filtered = useMemo(() => {
    if (statusFilter === "all") return requests
    return requests.filter((r) => r.status === statusFilter)
  }, [statusFilter, requests])

  const handleApprove = useCallback(async (id: string) => {
    try {
      setActionLoading(id)
      const svc = await getPrintingService()
      const updated = await svc.approvePrintRequest(id)
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve request")
    } finally {
      setActionLoading(null)
    }
  }, [])

  const handleComplete = useCallback(async (id: string) => {
    try {
      setActionLoading(id)
      const svc = await getPrintingService()
      const updated = await svc.completePrintRequest(id)
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete request")
    } finally {
      setActionLoading(null)
    }
  }, [])

  const columns: Column<PrintRequest>[] = [
    {
      key: "credentialId",
      header: "Credential ID",
      render: (r) => <span className="font-mono text-xs text-white">{r.credentialId.slice(0, 8)}...</span>,
    },
    {
      key: "credentialType",
      header: "Type",
      render: (r) => (
        <span className="text-white capitalize">{r.credentialType === "id_card" ? "ID Card" : "Certificate"}</span>
      ),
    },
    {
      key: "requestType",
      header: "Request Type",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {r.requestType}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <PrintStatusBadge status={r.status} />,
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (r) => <span className="text-gray-300">{r.requestedBy}</span>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (r) => <span className="text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status === "pending" && (
            <button
              onClick={(e) => { e.stopPropagation(); handleApprove(r.id) }}
              disabled={actionLoading === r.id}
              className="inline-flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3591E0] transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Approve
            </button>
          )}
          {r.status === "approved" && (
            <button
              onClick={(e) => { e.stopPropagation(); handleComplete(r.id) }}
              disabled={actionLoading === r.id}
              className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Complete
            </button>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Print Queue" description="Manage credential print requests" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Requests" value="-" icon={<Printer className="h-5 w-5" />} />
          <StatCard title="Pending" value="-" icon={<Printer className="h-5 w-5" />} />
          <StatCard title="Approved" value="-" icon={<Printer className="h-5 w-5" />} />
          <StatCard title="Completed" value="-" icon={<Printer className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading print requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Print Queue" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Print Queue"
          description="Manage credential print requests"
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

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Requests" value={stats.total} icon={<Printer className="h-5 w-5" />} />
        <StatCard title="Pending" value={stats.pending} icon={<Printer className="h-5 w-5 text-yellow-400" />} />
        <StatCard title="Approved" value={stats.approved} icon={<Printer className="h-5 w-5 text-blue-400" />} />
        <StatCard title="Completed" value={stats.completed} icon={<Printer className="h-5 w-5 text-green-400" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {PRINT_REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>{PRINT_REQUEST_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} emptyMessage="No print requests found." />
      </motion.div>
    </motion.div>
  )
}
