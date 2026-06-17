"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { StatCard } from "@/components/admin/StatCard"
import { getFormsService } from "@/lib/services"
import type { FormSubmission } from "@/types"
import { FileText } from "lucide-react"

export default function FormsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [stats, setStats] = useState({ new: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [statusFilter, setStatusFilter] = useState("All Status")

  useEffect(() => {
    getFormsService().then((svc) => {
      Promise.all([svc.listSubmissions(), svc.getSubmissionStats()]).then(([data, s]) => {
        setSubmissions(data)
        setStats(s)
        setLoading(false)
      })
    })
  }, [])

  const filtered = submissions.filter((s) => {
    if (typeFilter !== "All Types" && s.type !== typeFilter.toLowerCase()) return false
    if (statusFilter !== "All Status") {
      const statusMap: Record<string, string> = { "New": "new", "In Progress": "in_progress", "Resolved": "resolved" }
      if (s.status !== statusMap[statusFilter]) return false
    }
    return true
  })

  const columns: Column<FormSubmission>[] = [
    { key: "type", header: "Type", render: (s) => <span className="capitalize">{s.type}</span> },
    {
      key: "email", header: "Contact",
      render: (s) => <span>{(s.data as Record<string, string>).email || "-"}</span>,
    },
    {
      key: "status", header: "Status",
      render: (s) => <StatusBadge status={s.status} variant="submission" />,
    },
    {
      key: "assignedTo", header: "Assigned To",
      render: (s) => <span className="text-gray-400">{s.assignedTo || "Unassigned"}</span>,
    },
    {
      key: "createdAt", header: "Date",
      render: (s) => <span className="text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Form Submissions"
        description="Manage all website inquiries and submissions"
        actions={
          <div className="flex gap-3">
            <select
              className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-400"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>Contact</option>
              <option>Consultation</option>
              <option>Demo</option>
              <option>Partnership</option>
            </select>
            <select
              className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-400"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>New</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Submissions" value={stats.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="New" value={stats.new} icon={<FileText className="h-5 w-5" />} subtitle="Awaiting processing" />
        <StatCard title="Resolved" value={submissions.filter((s) => s.status === "resolved" || s.status === "closed").length} icon={<FileText className="h-5 w-5" />} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        onRowClick={(s) => router.push(`/app/forms/${s.id}`)}
        emptyMessage="No form submissions yet."
      />
    </div>
  )
}
