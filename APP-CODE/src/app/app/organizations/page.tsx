"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { StatCard } from "@/components/admin/StatCard"
import { getOrganizationService } from "@/lib/services"
import type { OrganizationProspect } from "@/types"
import { Building2, Users } from "lucide-react"

export default function OrganizationsPage() {
  const router = useRouter()
  const [prospects, setProspects] = useState<OrganizationProspect[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrganizationService().then((svc) => {
      svc.listProspects().then((data) => {
        setProspects(data)
        setLoading(false)
      })
    })
  }, [])

  const columns: Column<OrganizationProspect>[] = [
    { key: "organizationName", header: "Organization" },
    { key: "industryType", header: "Industry", render: (p) => <span className="text-gray-400">{p.industryType}</span> },
    { key: "country", header: "Country", render: (p) => <span className="text-gray-400">{p.country}</span> },
    { key: "expectedMembers", header: "Members", render: (p) => <span>{p.expectedMembers.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} variant="prospect" /> },
    { key: "createdAt", header: "Added", render: (p) => <span className="text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Organization Prospects"
        description="Track potential tenant organizations"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Prospects" value={prospects.length} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Qualified" value={prospects.filter((p) => p.status === "qualified").length} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Proposal Stage" value={prospects.filter((p) => p.status === "proposal_stage").length} icon={<Building2 className="h-5 w-5" />} />
      </div>

      <DataTable
        columns={columns}
        data={prospects}
        isLoading={loading}
        onRowClick={(p) => router.push(`/app/organizations/${p.id}`)}
        emptyMessage="No prospects yet."
      />
    </div>
  )
}
