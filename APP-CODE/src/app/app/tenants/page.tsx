"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { StatCard } from "@/components/admin/StatCard"
import { getTenantManagementService } from "@/lib/services"
import type { Tenant } from "@/types"
import { Search, X, Building2, Clock, AlertTriangle, CheckCircle, Archive, Pause, Play, Plus } from "lucide-react"

export default function TenantsPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [commercialFilter, setCommercialFilter] = useState<string>("all")
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<Tenant | null>(null)
  const [error, setError] = useState("")
  const [createForm, setCreateForm] = useState({
    organizationName: "", shortName: "", abbreviation: "", domain: "", subdomain: "",
    organizationType: "association", country: "", region: "", industry: "",
    plan: "basic", subscription: "monthly", commissionModel: "percentage", revenueDistributionModel: "shared",
    adminName: "", adminEmail: "", adminPhone: "",
  })

  const lifecycleStatuses = ["all", "prospect", "qualified", "proposal_accepted", "contract_signed", "setup", "activated"] as const
  const commercialStatuses = ["all", "active", "trial", "past_due", "inactive", "suspended", "archived", "cancelled"] as const

  useEffect(() => {
    async function load() {
      try {
        const svc = await getTenantManagementService()
        const data = await svc.listTenants()
        setTenants(data)
      } catch {
        setError("Failed to load tenants")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const total = tenants.length
    const active = tenants.filter((t) => t.commercialStatus === "active").length
    const trial = tenants.filter((t) => t.commercialStatus === "trial").length
    const suspended = tenants.filter((t) => t.commercialStatus === "suspended" || t.commercialStatus === "past_due").length
    return { total, active, trial, suspended }
  }, [tenants])

  const filtered = useMemo(() => {
    let result = [...tenants]
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter)
    if (commercialFilter !== "all") result = result.filter((t) => t.commercialStatus === commercialFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((t) =>
        t.organizationName.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.adminEmail.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q)
      )
    }
    return result
  }, [tenants, search, statusFilter, commercialFilter])

  async function handleCreate() {
    if (!createForm.organizationName || !createForm.adminEmail) return
    try {
      const svc = await getTenantManagementService()
      const tenant = await svc.createTenant({
        tenantId: `new-${Date.now()}`,
        organizationName: createForm.organizationName,
        shortName: createForm.shortName,
        abbreviation: createForm.abbreviation,
        domain: createForm.domain,
        subdomain: createForm.subdomain,
        organizationType: createForm.organizationType,
        country: createForm.country,
        region: createForm.region,
        industry: createForm.industry,
        logo: "",
        primaryColor: "#3CA4F9",
        secondaryColor: "#1e3a5f",
        plan: createForm.plan,
        subscription: createForm.subscription,
        commissionModel: createForm.commissionModel,
        revenueDistributionModel: createForm.revenueDistributionModel,
        adminName: createForm.adminName,
        adminEmail: createForm.adminEmail,
        adminPhone: createForm.adminPhone,
        status: "prospect",
        commercialStatus: "prospect",
      })
      setTenants((prev) => [tenant, ...prev])
      setShowCreate(false)
      resetCreateForm()
    } catch {
      setError("Failed to create tenant")
    }
  }

  async function handleUpdate() {
    if (!showEdit) return
    try {
      const svc = await getTenantManagementService()
      await svc.updateTenant(showEdit.id, {
        organizationName: showEdit.organizationName,
        shortName: showEdit.shortName,
        domain: showEdit.domain,
        country: showEdit.country,
        industry: showEdit.industry,
        plan: showEdit.plan,
        adminName: showEdit.adminName,
        adminEmail: showEdit.adminEmail,
        adminPhone: showEdit.adminPhone,
      })
      setTenants((prev) => prev.map((t) => (t.id === showEdit.id ? { ...t, ...showEdit } : t)))
      setShowEdit(null)
    } catch {
      setError("Failed to update tenant")
    }
  }

  async function handleStatusChange(id: string, action: "activate" | "suspend" | "reactivate" | "archive") {
    try {
      const svc = await getTenantManagementService()
      if (action === "activate") await svc.activateTenant(id)
      else if (action === "suspend") await svc.suspendTenant(id)
      else if (action === "reactivate") await svc.reactivateTenant(id)
      else if (action === "archive") await svc.archiveTenant(id)
      const data = await svc.listTenants()
      setTenants(data)
    } catch {
      setError(`Failed to ${action} tenant`)
    }
  }

  function resetCreateForm() {
    setCreateForm({
      organizationName: "", shortName: "", abbreviation: "", domain: "", subdomain: "",
      organizationType: "association", country: "", region: "", industry: "",
      plan: "basic", subscription: "monthly", commissionModel: "percentage", revenueDistributionModel: "shared",
      adminName: "", adminEmail: "", adminPhone: "",
    })
  }

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
    { key: "plan", header: "Plan", render: (t) => <span className="text-sm capitalize text-gray-300">{t.plan}</span> },
    { key: "country", header: "Country", render: (t) => <span className="text-sm text-gray-300">{t.country || "—"}</span> },
    {
      key: "status",
      header: "Lifecycle",
      render: (t) => <StatusBadge status={t.status} variant="tenant" />,
    },
    {
      key: "commercialStatus",
      header: "Commercial",
      render: (t) => {
        const variant = t.commercialStatus === "active" ? "active" as const :
          t.commercialStatus === "trial" ? "trial" as const :
          t.commercialStatus === "past_due" || t.commercialStatus === "suspended" ? "warning" as const :
          t.commercialStatus === "archived" ? "inactive" as const : "default" as const
        return (
          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
            variant === "active" ? "border-green-500/30 bg-green-500/10 text-green-400" :
            variant === "trial" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
            variant === "warning" ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" :
            variant === "inactive" ? "border-gray-500/30 bg-gray-500/10 text-gray-400" :
            "border-[#1e3a5f] text-gray-400"
          }`}>{t.commercialStatus}</span>
        )
      },
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (t) => <span className="text-sm text-gray-400">{new Date(t.updatedAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (t) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setShowEdit({ ...t }) }}
            className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
          >
            Edit
          </button>
          {t.commercialStatus === "suspended" || t.commercialStatus === "past_due" ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleStatusChange(t.id, "reactivate") }}
              className="rounded border border-green-500/30 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10"
            >
              <Play className="h-3 w-3 inline mr-0.5" /> Reactivate
            </button>
          ) : t.commercialStatus === "active" || t.commercialStatus === "trial" ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleStatusChange(t.id, "suspend") }}
              className="rounded border border-yellow-500/30 px-2 py-1 text-xs text-yellow-400 hover:bg-yellow-500/10"
            >
              <Pause className="h-3 w-3 inline mr-0.5" /> Suspend
            </button>
          ) : null}
          {t.commercialStatus !== "archived" && t.commercialStatus !== "cancelled" && (
            <button
              onClick={(e) => { e.stopPropagation(); handleStatusChange(t.id, "archive") }}
              className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
            >
              <Archive className="h-3 w-3 inline mr-0.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/app/tenants/${t.id}`) }}
            className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
          >
            View
          </button>
        </div>
      ),
    },
  ]

  const formFields = [
    { label: "Organization Name", key: "organizationName", required: true },
    { label: "Short Name", key: "shortName" },
    { label: "Abbreviation", key: "abbreviation" },
    { label: "Domain", key: "domain" },
    { label: "Subdomain", key: "subdomain" },
    { label: "Organization Type", key: "organizationType", type: "select", options: ["association", "corporation", "nonprofit", "government", "educational", "cooperative"] },
    { label: "Country", key: "country" },
    { label: "Region", key: "region" },
    { label: "Industry", key: "industry" },
    { label: "Plan", key: "plan", type: "select", options: ["basic", "professional", "enterprise", "custom"] },
    { label: "Subscription", key: "subscription", type: "select", options: ["monthly", "annual", "biennial"] },
    { label: "Admin Name", key: "adminName" },
    { label: "Admin Email", key: "adminEmail", required: true },
    { label: "Admin Phone", key: "adminPhone" },
  ]

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
        <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Tenant Management"
        description="Manage all tenants across the platform"
        actions={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]">
            <Plus className="h-4 w-4" /> Create Tenant
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard title="Total Tenants" value={stats.total} icon={<Building2 className="h-8 w-8" />} />
        <StatCard title="Active" value={stats.active} icon={<CheckCircle className="h-8 w-8" />} />
        <StatCard title="On Trial" value={stats.trial} icon={<Clock className="h-8 w-8" />} />
        <StatCard title="Suspended / Past Due" value={stats.suspended} icon={<AlertTriangle className="h-8 w-8" />} />
      </div>

      {showCreate && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Create New Tenant</h3>
            <button onClick={() => { setShowCreate(false); resetCreateForm() }} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formFields.map((f) => (
              <div key={f.key}>
                <label className="form-label">{f.label}{f.required ? " *" : ""}</label>
                {f.type === "select" ? (
                  <select
                    value={(createForm as any)[f.key]}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="form-input"
                  >
                    {f.options!.map((opt) => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.key === "adminEmail" ? "email" : "text"}
                    value={(createForm as any)[f.key]}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.label}
                    className="form-input"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleCreate} disabled={!createForm.organizationName || !createForm.adminEmail} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              Create Tenant
            </button>
            <button onClick={() => { setShowCreate(false); resetCreateForm() }} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Edit Tenant</h3>
            <button onClick={() => setShowEdit(null)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Organization Name", key: "organizationName" },
              { label: "Short Name", key: "shortName" },
              { label: "Domain", key: "domain" },
              { label: "Country", key: "country" },
              { label: "Industry", key: "industry" },
              { label: "Plan", key: "plan", type: "select", options: ["basic", "professional", "enterprise", "custom"] },
              { label: "Admin Name", key: "adminName" },
              { label: "Admin Email", key: "adminEmail" },
              { label: "Admin Phone", key: "adminPhone" },
            ].map((f) => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={(showEdit as any)[f.key]}
                    onChange={(e) => setShowEdit((prev) => prev ? { ...prev, [f.key]: e.target.value } : null)}
                    className="form-input"
                  >
                    {f.options!.map((opt) => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.key === "adminEmail" ? "email" : "text"}
                    value={(showEdit as any)[f.key]}
                    onChange={(e) => setShowEdit((prev) => prev ? { ...prev, [f.key]: e.target.value } : null)}
                    className="form-input"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleUpdate} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white">Save Changes</button>
            <button onClick={() => setShowEdit(null)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants..."
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300 focus:border-[#3CA4F9]/50 focus:outline-none"
        >
          {lifecycleStatuses.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Lifecycle" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
        <select
          value={commercialFilter}
          onChange={(e) => setCommercialFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300 focus:border-[#3CA4F9]/50 focus:outline-none"
        >
          {commercialStatuses.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Commercial" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        onRowClick={(t) => router.push(`/app/tenants/${t.id}`)}
        emptyMessage="No tenants match your search."
      />
    </div>
  )
}
