"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getOrganizationService, getTenantProvisioningService } from "@/lib/services"
import type { OrganizationProspect, Tenant } from "@/types"
import { Building2, Users, Search } from "lucide-react"

export default function OrganizationsPage() {
  const router = useRouter()
  const [prospects, setProspects] = useState<OrganizationProspect[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"prospects" | "tenants">("prospects")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      const [orgSvc, tenantSvc] = await Promise.all([getOrganizationService(), getTenantProvisioningService()])
      const [prospectData, tenantData] = await Promise.all([
        orgSvc.listProspects(),
        tenantSvc.listTenants(),
      ])
      setProspects(prospectData)
      setTenants(tenantData)
      setLoading(false)
    }
    load()
  }, [])

  const filteredProspects = useMemo(() => {
    if (!search) return prospects
    const q = search.toLowerCase()
    return prospects.filter(
      (p) =>
        p.organizationName.toLowerCase().includes(q) ||
        p.industryType.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
    )
  }, [prospects, search])

  const filteredTenants = useMemo(() => {
    if (!search) return tenants
    const q = search.toLowerCase()
    return tenants.filter(
      (t) =>
        t.organizationName.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q)
    )
  }, [tenants, search])

  const prospectColumns: Column<OrganizationProspect>[] = [
    { key: "organizationName", header: "Organization", render: (p) => <span className="font-medium text-white">{p.organizationName}</span> },
    { key: "industryType", header: "Industry", render: (p) => <span className="text-gray-400">{p.industryType}</span> },
    { key: "country", header: "Country", render: (p) => <span className="text-gray-400">{p.country}</span> },
    { key: "expectedMembers", header: "Members", render: (p) => <span>{p.expectedMembers.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} variant="prospect" /> },
    { key: "createdAt", header: "Added", render: (p) => <span className="text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span> },
  ]

  const tenantColumns: Column<Tenant>[] = [
    { key: "organizationName", header: "Organization", render: (t) => (
      <div>
        <span className="font-medium text-white">{t.organizationName}</span>
        <span className="ml-2 text-xs text-gray-500">({t.shortName})</span>
      </div>
    )},
    { key: "plan", header: "Plan", render: (t) => <span className="rounded bg-[#3CA4F9]/10 px-1.5 py-0.5 text-xs text-[#3CA4F9]">{t.plan}</span> },
    { key: "country", header: "Country", render: (t) => <span className="text-gray-400">{t.country}</span> },
    { key: "status", header: "Lifecycle", render: (t) => <StatusBadge status={t.status} variant="tenant" /> },
    { key: "commercialStatus", header: "Commercial", render: (t) => {
      const colors: Record<string, string> = {
        active: "bg-green-500/10 text-green-400",
        trial: "bg-blue-500/10 text-blue-400",
        past_due: "bg-yellow-500/10 text-yellow-400",
        cancelled: "bg-red-500/10 text-red-400",
        suspended: "bg-red-500/10 text-red-400",
      }
      return (
        <span className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase ${colors[t.commercialStatus] || "bg-gray-500/10 text-gray-400"}`}>
          {t.commercialStatus}
        </span>
      )
    }},
    { key: "updatedAt", header: "Last Updated", render: (t) => <span className="text-gray-400">{new Date(t.updatedAt).toLocaleDateString()}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Organization Directory"
        description="Track prospects and manage tenant organizations"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Prospects</p>
          <p className="mt-1 text-2xl font-bold text-white">{prospects.length}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active Tenants</p>
          <p className="mt-1 text-2xl font-bold text-white">{tenants.filter((t) => t.commercialStatus === "active").length}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Trial / Past Due</p>
          <p className="mt-1 text-2xl font-bold text-yellow-400">
            {tenants.filter((t) => t.commercialStatus === "trial" || t.commercialStatus === "past_due").length}
          </p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Qualified Prospects</p>
          <p className="mt-1 text-2xl font-bold text-white">{prospects.filter((p) => p.status === "qualified").length}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-[#1e3a5f] overflow-hidden">
          <button
            onClick={() => setTab("prospects")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "prospects" ? "bg-[#3CA4F9]/15 text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}
          >
            Prospects ({prospects.length})
          </button>
          <button
            onClick={() => setTab("tenants")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "tenants" ? "bg-[#3CA4F9]/15 text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}
          >
            Tenants ({tenants.length})
          </button>
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${tab}...`}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
        </div>
      </div>

      {tab === "prospects" ? (
        <DataTable
          columns={prospectColumns}
          data={filteredProspects}
          isLoading={loading}
          onRowClick={(p) => router.push(`/app/organizations/${p.id}`)}
          emptyMessage="No prospects match your search."
        />
      ) : (
        <DataTable
          columns={tenantColumns}
          data={filteredTenants}
          isLoading={loading}
          emptyMessage="No tenants match your search."
        />
      )}
    </div>
  )
}
