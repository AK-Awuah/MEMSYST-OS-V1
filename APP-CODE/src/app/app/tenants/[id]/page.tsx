"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Tabs } from "@/components/admin/Tabs"
import { getTenantManagementService } from "@/lib/services"
import type { Tenant } from "@/types"
import { OverviewTab } from "@/components/admin/tenants/OverviewTab"
import { ProfileTab } from "@/components/admin/tenants/ProfileTab"
import { BrandingTab } from "@/components/admin/tenants/BrandingTab"
import { StructureTab } from "@/components/admin/tenants/StructureTab"
import { ExecutivesTab } from "@/components/admin/tenants/ExecutivesTab"
import { GovernanceTab } from "@/components/admin/tenants/GovernanceTab"
import { SettingsTab } from "@/components/admin/tenants/SettingsTab"
import { DocumentsTab } from "@/components/admin/tenants/DocumentsTab"
import { AuditTab } from "@/components/admin/tenants/AuditTab"
import { ArrowLeft, Play, Pause, Archive, RotateCcw } from "lucide-react"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "profile", label: "Profile" },
  { id: "branding", label: "Branding" },
  { id: "structure", label: "Structure" },
  { id: "executives", label: "Executives" },
  { id: "governance", label: "Governance" },
  { id: "settings", label: "Settings" },
  { id: "documents", label: "Documents" },
  { id: "audit", label: "Audit Log" },
]

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState("")

  async function loadTenant() {
    const svc = await getTenantManagementService()
    const data = await svc.getTenant(params.id as string)
    setTenant(data)
    setLoading(false)
  }

  useEffect(() => {
    loadTenant()
  }, [params.id])

  async function handleLifecycleAction(action: "activate" | "suspend" | "reactivate" | "archive") {
    if (!tenant) return
    try {
      const svc = await getTenantManagementService()
      if (action === "activate") await svc.activateTenant(tenant.id)
      else if (action === "suspend") await svc.suspendTenant(tenant.id)
      else if (action === "reactivate") await svc.reactivateTenant(tenant.id)
      else if (action === "archive") await svc.archiveTenant(tenant.id)
      loadTenant()
    } catch {
      setError(`Failed to ${action} tenant`)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!tenant) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Tenant not found</p>
        <button onClick={() => router.push("/app/tenants")} className="mt-4 text-[#3CA4F9] underline">Back to Tenants</button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={tenant.organizationName}
        description={`${tenant.shortName} · ${tenant.country}`}
        actions={
          <div className="flex items-center gap-2">
            {error && <span className="text-xs text-red-400">{error}</span>}
            {tenant.commercialStatus === "suspended" || tenant.commercialStatus === "past_due" ? (
              <button onClick={() => handleLifecycleAction("reactivate")}
                className="flex items-center gap-1 rounded-lg border border-green-500/30 px-3 py-1.5 text-xs text-green-400 hover:bg-green-500/10">
                <RotateCcw className="h-3 w-3" /> Reactivate
              </button>
            ) : tenant.commercialStatus === "active" || tenant.commercialStatus === "trial" ? (
              <button onClick={() => handleLifecycleAction("suspend")}
                className="flex items-center gap-1 rounded-lg border border-yellow-500/30 px-3 py-1.5 text-xs text-yellow-400 hover:bg-yellow-500/10">
                <Pause className="h-3 w-3" /> Suspend
              </button>
            ) : null}
            {tenant.commercialStatus !== "archived" && tenant.commercialStatus !== "cancelled" && (
              <button onClick={() => handleLifecycleAction("archive")}
                className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                <Archive className="h-3 w-3" /> Archive
              </button>
            )}
            <button onClick={() => router.back()} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        }
      />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "overview" && <OverviewTab tenant={tenant} />}
        {activeTab === "profile" && <ProfileTab tenant={tenant} />}
        {activeTab === "branding" && <BrandingTab tenant={tenant} />}
        {activeTab === "structure" && <StructureTab tenant={tenant} />}
        {activeTab === "executives" && <ExecutivesTab tenant={tenant} />}
        {activeTab === "governance" && <GovernanceTab tenant={tenant} />}
        {activeTab === "settings" && <SettingsTab tenant={tenant} />}
        {activeTab === "documents" && <DocumentsTab tenant={tenant} />}
        {activeTab === "audit" && <AuditTab tenant={tenant} />}
      </div>
    </div>
  )
}
