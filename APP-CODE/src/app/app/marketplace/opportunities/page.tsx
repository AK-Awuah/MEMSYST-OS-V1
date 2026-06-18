"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getOpportunityService } from "@/lib/services"
import type { Opportunity } from "@/types"
import { OPPORTUNITY_TYPES, OPPORTUNITY_TYPE_LABELS, OPPORTUNITY_STATUSES, OPPORTUNITY_STATUS_LABELS } from "@/lib/constants"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const statusColors: Record<string, string> = {
  open: "bg-green-500/15 text-green-400 border-green-500/30",
  closed: "bg-red-500/15 text-red-400 border-red-500/30",
  archived: "bg-gray-500/15 text-gray-400 border-gray-500/30",
}

function StatusBadge({ status }: { status: string }) {
  const c = statusColors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = OPPORTUNITY_STATUS_LABELS[status as keyof typeof OPPORTUNITY_STATUS_LABELS] || status
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>{label}</span>
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getOpportunityService()
        const data = await svc.listOpportunities("tenant-1")
        if (!cancelled) setOpportunities(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load opportunities")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    let result = opportunities
    if (typeFilter !== "all") result = result.filter((o) => o.opportunityType === typeFilter)
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter)
    return result
  }, [typeFilter, statusFilter, opportunities])

  const columns: Column<Opportunity>[] = [
    {
      key: "title",
      header: "Title",
      render: (o) => (
        <Link href={`/app/marketplace/opportunities/${o.id}`} className="flex items-center gap-1 text-white hover:text-[#3CA4F9] font-medium">
          {o.title} <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "opportunityType",
      header: "Type",
      render: (o) => <span className="text-gray-300 capitalize">{OPPORTUNITY_TYPE_LABELS[o.opportunityType] || o.opportunityType.replace(/_/g, " ")}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (o) => <StatusBadge status={o.status} />,
    },
    { key: "location", header: "Location", render: (o) => <span className="text-gray-400 text-xs">{o.location || "-"}</span> },
    {
      key: "applicationCount",
      header: "Applications",
      render: (o) => <span className="text-gray-300">{o.applicationCount}</span>,
    },
    {
      key: "applicationDeadline",
      header: "Deadline",
      render: (o) => (
        <span className="text-gray-400 text-xs">
          {o.applicationDeadline ? new Date(o.applicationDeadline).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Opportunities" description="Manage employment and business opportunities" />
        <div className="flex items-center justify-center py-16"><p className="text-sm text-gray-500">Loading opportunities...</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Opportunities" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Opportunities"
          description="Employment, apprenticeship, partnerships and more"
          actions={
            <Link href="/app/marketplace/opportunities/new" className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90">
              <Plus className="h-4 w-4" /> New Opportunity
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Types</option>
          {OPPORTUNITY_TYPES.map((t) => (
            <option key={t} value={t}>{OPPORTUNITY_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {OPPORTUNITY_STATUSES.map((s) => (
            <option key={s} value={s}>{OPPORTUNITY_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} emptyMessage="No opportunities found." />
      </motion.div>
    </motion.div>
  )
}
