"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { StatCard } from "@/components/admin/StatCard"
import { getLeadsService } from "@/lib/services"
import type { Lead } from "@/types"
import { Users, UserPlus, DollarSign } from "lucide-react"

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState({ total: 0, new: 0, qualified: 0, won: 0, lost: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeadsService().then((svc) => {
      Promise.all([svc.listLeads(), svc.getLeadStats()]).then(([data, s]) => {
        setLeads(data)
        setStats(s)
        setLoading(false)
      })
    })
  }, [])

  const columns: Column<Lead>[] = [
    { key: "organizationName", header: "Organization" },
    { key: "contactPerson", header: "Contact", render: (l) => (
      <div><p className="text-white">{l.contactPerson}</p><p className="text-xs text-gray-500">{l.email}</p></div>
    )},
    { key: "organizationType", header: "Type", render: (l) => <span className="text-gray-400">{l.organizationType}</span> },
    { key: "estimatedValue", header: "Value", render: (l) => <span>GH₵{l.estimatedValue.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (l) => <StatusBadge status={l.status} variant="lead" /> },
    { key: "createdAt", header: "Created", render: (l) => <span className="text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Manage prospects and track the sales pipeline"
        actions={
          <button
            onClick={() => router.push("/app/leads/new")}
            className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]"
          >
            + New Lead
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard title="Total Leads" value={stats.total} icon={<Users className="h-5 w-5" />} />
        <StatCard title="New" value={stats.new} icon={<UserPlus className="h-5 w-5" />} subtitle="Needs qualification" />
        <StatCard title="Qualified" value={stats.qualified} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Value" value={`GH₵${leads.reduce((s, l) => s + l.estimatedValue, 0).toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <DataTable
        columns={columns}
        data={leads}
        isLoading={loading}
        onRowClick={(l) => router.push(`/app/leads/${l.id}`)}
        emptyMessage="No leads yet."
      />
    </div>
  )
}
