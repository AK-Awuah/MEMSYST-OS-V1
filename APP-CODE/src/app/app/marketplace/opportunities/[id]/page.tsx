"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Archive, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getOpportunityService } from "@/lib/services"
import type { Opportunity, OpportunityApplication } from "@/types"
import { OPPORTUNITY_TYPE_LABELS, OPPORTUNITY_STATUS_LABELS } from "@/lib/constants"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const applicationStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  reviewed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  accepted: "bg-green-500/15 text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [applications, setApplications] = useState<OpportunityApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = async () => {
    try {
      setLoading(true)
      const svc = await getOpportunityService()
      const [opp, apps] = await Promise.all([
        svc.getOpportunity(id),
        svc.getApplications(id),
      ])
      setOpportunity(opp)
      setApplications(apps)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load opportunity")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  const handleStatusChange = async (status: "closed" | "archived") => {
    if (!opportunity) return
    try {
      const svc = await getOpportunityService()
      await svc.updateOpportunityStatus(opportunity.id, status)
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status")
    }
  }

  const handleApplicationStatus = async (appId: string, status: string) => {
    try {
      const svc = await getOpportunityService()
      await svc.updateApplicationStatus(appId, status)
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update application status")
    }
  }

  const appColumns: Column<OpportunityApplication>[] = [
    { key: "applicantName", header: "Name", render: (a) => <span className="text-white font-medium">{a.applicantName}</span> },
    { key: "applicantEmail", header: "Email", render: (a) => <span className="text-gray-400 text-xs">{a.applicantEmail}</span> },
    {
      key: "status", header: "Status", render: (a) => {
        const c = applicationStatusColors[a.status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
        return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>{a.status}</span>
      },
    },
    {
      key: "createdAt", header: "Applied", render: (a) => (
        <span className="text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions", header: "", render: (a) => (
        <div className="flex gap-2">
          {a.status === "pending" && (
            <>
              <button onClick={() => handleApplicationStatus(a.id, "reviewed")} className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/30">Review</button>
              <button onClick={() => handleApplicationStatus(a.id, "accepted")} className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/30">Accept</button>
              <button onClick={() => handleApplicationStatus(a.id, "rejected")} className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30">Reject</button>
            </>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Opportunity Details" />
        <div className="flex items-center justify-center py-16"><p className="text-sm text-gray-500">Loading opportunity...</p></div>
      </div>
    )
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Opportunity Details"
          actions={<Link href="/app/marketplace/opportunities" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</Link>}
        />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Opportunity not found"}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title={opportunity.title}
          description={`${OPPORTUNITY_TYPE_LABELS[opportunity.opportunityType]} · ${OPPORTUNITY_STATUS_LABELS[opportunity.status]}`}
          actions={
            <div className="flex gap-2">
              <Link href="/app/marketplace/opportunities" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
              {opportunity.status === "open" && (
                <>
                  <button onClick={() => handleStatusChange("closed")} className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                    <XCircle className="h-4 w-4" /> Close
                  </button>
                  <button onClick={() => handleStatusChange("archived")} className="flex items-center gap-2 rounded-lg border border-gray-500/30 px-3 py-2 text-sm text-gray-400 hover:bg-gray-500/10">
                    <Archive className="h-4 w-4" /> Archive
                  </button>
                </>
              )}
            </div>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Description</h3>
            <p className="text-white whitespace-pre-wrap leading-relaxed">{opportunity.description || "No description provided."}</p>
          </div>
          {opportunity.requirements.length > 0 && (
            <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                {opportunity.requirements.map((r, i) => (
                  <li key={i} className="text-white text-sm">{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
            <dl className="space-y-3">
              <div><dt className="text-xs text-gray-500">Type</dt><dd className="text-sm text-white">{OPPORTUNITY_TYPE_LABELS[opportunity.opportunityType]}</dd></div>
              <div><dt className="text-xs text-gray-500">Status</dt><dd className="text-sm text-white">{OPPORTUNITY_STATUS_LABELS[opportunity.status]}</dd></div>
              <div><dt className="text-xs text-gray-500">Location</dt><dd className="text-sm text-white">{opportunity.location || "-"}</dd></div>
              <div><dt className="text-xs text-gray-500">Deadline</dt><dd className="text-sm text-white">{opportunity.applicationDeadline ? new Date(opportunity.applicationDeadline).toLocaleDateString() : "-"}</dd></div>
              <div><dt className="text-xs text-gray-500">Applications</dt><dd className="text-sm text-white">{opportunity.applicationCount}</dd></div>
              <div><dt className="text-xs text-gray-500">Views</dt><dd className="text-sm text-white">{opportunity.viewCount}</dd></div>
              <div><dt className="text-xs text-gray-500">Created</dt><dd className="text-sm text-white">{new Date(opportunity.createdAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Applications ({applications.length})</h3>
          <DataTable columns={appColumns} data={applications} emptyMessage="No applications received yet." />
        </div>
      </motion.div>
    </motion.div>
  )
}
