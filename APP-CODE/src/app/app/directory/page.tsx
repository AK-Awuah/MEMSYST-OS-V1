"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getTenantManagementService } from "@/lib/services"
import type { Tenant } from "@/types"
import { Search, Building2, Globe, Users } from "lucide-react"

export default function DirectoryPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    getTenantManagementService().then((svc) =>
      svc.listTenants().then((data) => {
        setTenants(data)
        setLoading(false)
      })
    )
  }, [])

  const stats = useMemo(() => {
    const total = tenants.length
    const countries = [...new Set(tenants.map((t) => t.country).filter(Boolean))]
    const types = [...new Set(tenants.map((t) => t.organizationType))]
    const industries = [...new Set(tenants.map((t) => t.industry).filter(Boolean))]
    return { total, countries: countries.length, types: types.length, industries: industries.length }
  }, [tenants])

  const countries = useMemo(() => [...new Set(tenants.map((t) => t.country).filter(Boolean))], [tenants])
  const industries = useMemo(() => [...new Set(tenants.map((t) => t.industry).filter(Boolean))], [tenants])
  const types = useMemo(() => [...new Set(tenants.map((t) => t.organizationType))], [tenants])

  const filtered = useMemo(() => {
    let result = [...tenants]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((t) =>
        t.organizationName.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.adminEmail.toLowerCase().includes(q) ||
        t.industry?.toLowerCase().includes(q)
      )
    }
    if (countryFilter !== "all") result = result.filter((t) => t.country === countryFilter)
    if (industryFilter !== "all") result = result.filter((t) => t.industry === industryFilter)
    if (typeFilter !== "all") result = result.filter((t) => t.organizationType === typeFilter)
    return result
  }, [tenants, search, countryFilter, industryFilter, typeFilter])

  const columns: Column<Tenant>[] = [
    {
      key: "organizationName",
      header: "Organization",
      render: (t) => (
        <div>
          <div className="font-medium text-white">{t.organizationName}</div>
          <div className="text-xs text-gray-500">{t.shortName}</div>
        </div>
      ),
    },
    { key: "organizationType", header: "Type", render: (t) => <span className="text-sm capitalize text-gray-300">{t.organizationType}</span> },
    { key: "country", header: "Country", render: (t) => <span className="text-sm text-gray-300">{t.country || "—"}</span> },
    { key: "industry", header: "Industry", render: (t) => <span className="text-sm text-gray-300">{t.industry || "—"}</span> },
    { key: "plan", header: "Plan", render: (t) => <span className="text-sm capitalize text-gray-300">{t.plan}</span> },
    { key: "commercialStatus", header: "Status", render: (t) => <StatusBadge status={t.commercialStatus} variant="tenant" /> },
  ]

  return (
    <div>
      <PageHeader
        title="Organization Directory"
        description="Browse and search all organizations across the platform"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Organizations</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Countries</p>
            <Globe className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{stats.countries}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Organization Types</p>
            <Building2 className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{stats.types}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Industries</p>
            <Users className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{stats.industries}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
        </div>
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300">
          <option value="all">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300">
          <option value="all">All Industries</option>
          {industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300">
          <option value="all">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        onRowClick={(t) => router.push(`/app/tenants/${t.id}`)}
        emptyMessage="No organizations match your search."
      />
    </div>
  )
}
