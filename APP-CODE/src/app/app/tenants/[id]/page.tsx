"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getTenantManagementService } from "@/lib/services"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { Tenant, TenantProfile, TenantBranding } from "@/types"
import { ArrowLeft, Save, X } from "lucide-react"

type Tab = "details" | "profile" | "branding" | "lifecycle"

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [branding, setBranding] = useState<TenantBranding | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("details")
  const [editProfile, setEditProfile] = useState(false)
  const [editBranding, setEditBranding] = useState(false)
  const [profileForm, setProfileForm] = useState<Partial<TenantProfile>>({})
  const [brandingForm, setBrandingForm] = useState<Partial<TenantBranding>>({})

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "profile", label: "Profile" },
    { key: "branding", label: "Branding" },
    { key: "lifecycle", label: "Lifecycle" },
  ]

  useEffect(() => {
    async function load() {
      try {
        const svc = await getTenantManagementService()
        const id = params.id as string
        const t = await svc.getTenant(id)
        if (t) {
          setTenant(t)
          const [p, b] = await Promise.all([svc.getProfile(id), svc.getBranding(id)])
          setProfile(p)
          setBranding(b)
          setProfileForm(p || {})
          setBrandingForm(b || {})
        }
      } catch {
        setError("Failed to load tenant")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  async function handleLifecycleAction(action: "activate" | "suspend" | "reactivate" | "archive") {
    if (!tenant) return
    setUpdating(true)
    try {
      const svc = await getTenantManagementService()
      await svc[action === "activate" ? "activateTenant" :
        action === "suspend" ? "suspendTenant" :
        action === "reactivate" ? "reactivateTenant" : "archiveTenant"](tenant.id)
      const updated = await svc.getTenant(tenant.id)
      if (updated) setTenant(updated)
    } catch {
      setError(`Failed to ${action} tenant`)
    } finally {
      setUpdating(false)
    }
  }

  async function handleSaveProfile() {
    if (!tenant) return
    setUpdating(true)
    try {
      const svc = await getTenantManagementService()
      await svc.updateProfile(tenant.id, profileForm)
      const p = await svc.getProfile(tenant.id)
      if (p) setProfile(p)
      setEditProfile(false)
    } catch {
      setError("Failed to save profile")
    } finally {
      setUpdating(false)
    }
  }

  async function handleSaveBranding() {
    if (!tenant) return
    setUpdating(true)
    try {
      const svc = await getTenantManagementService()
      await svc.updateBranding(tenant.id, brandingForm)
      const b = await svc.getBranding(tenant.id)
      if (b) setBranding(b)
      setEditBranding(false)
    } catch {
      setError("Failed to save branding")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
        <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
      </div>
    )
  }

  if (!tenant) {
    return <div className="py-20 text-center text-gray-400">Tenant not found.</div>
  }

  const commercialVariant = tenant.commercialStatus === "active" ? "active" as const :
    tenant.commercialStatus === "trial" ? "trial" as const :
    tenant.commercialStatus === "past_due" || tenant.commercialStatus === "suspended" ? "warning" as const :
    tenant.commercialStatus === "archived" ? "inactive" as const : "default" as const

  return (
    <div className="max-w-4xl">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Tenants
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{tenant.organizationName}</h1>
          <StatusBadge status={tenant.status} variant="tenant" />
        </div>
        <p className="mt-1 text-sm text-gray-400">
          {tenant.shortName} {tenant.abbreviation ? `(${tenant.abbreviation})` : ""} &middot; {tenant.plan} plan
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-[#1e3a5f]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.key
                ? "border-[#3CA4F9] text-[#3CA4F9]"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">General Information</h2>
            <dl className="space-y-3">
              <div><dt className="text-xs text-gray-500">Organization Name</dt><dd className="text-sm text-white">{tenant.organizationName}</dd></div>
              <div><dt className="text-xs text-gray-500">Short Name</dt><dd className="text-sm text-white">{tenant.shortName}</dd></div>
              <div><dt className="text-xs text-gray-500">Abbreviation</dt><dd className="text-sm text-white">{tenant.abbreviation || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Domain</dt><dd className="text-sm text-white">{tenant.domain || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Subdomain</dt><dd className="text-sm text-white">{tenant.subdomain || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Organization Type</dt><dd className="text-sm capitalize text-white">{tenant.organizationType || "—"}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Location & Industry</h2>
            <dl className="space-y-3">
              <div><dt className="text-xs text-gray-500">Country</dt><dd className="text-sm text-white">{tenant.country || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Region</dt><dd className="text-sm text-white">{tenant.region || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Industry</dt><dd className="text-sm text-white">{tenant.industry || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Plan</dt><dd className="text-sm capitalize text-white">{tenant.plan}</dd></div>
              <div><dt className="text-xs text-gray-500">Subscription</dt><dd className="text-sm capitalize text-white">{tenant.subscription}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Admin Contact</h2>
            <dl className="space-y-3">
              <div><dt className="text-xs text-gray-500">Name</dt><dd className="text-sm text-white">{tenant.adminName || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Email</dt><dd className="text-sm text-white">{tenant.adminEmail || "—"}</dd></div>
              <div><dt className="text-xs text-gray-500">Phone</dt><dd className="text-sm text-white">{tenant.adminPhone || "—"}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Status</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Lifecycle Status</dt>
                <dd className="mt-1"><StatusBadge status={tenant.status} variant="tenant" /></dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Commercial Status</dt>
                <dd className="mt-1">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    commercialVariant === "active" ? "border-green-500/30 bg-green-500/10 text-green-400" :
                    commercialVariant === "trial" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
                    commercialVariant === "warning" ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" :
                    commercialVariant === "inactive" ? "border-gray-500/30 bg-gray-500/10 text-gray-400" :
                    "border-[#1e3a5f] text-gray-400"
                  }`}>{tenant.commercialStatus}</span>
                </dd>
              </div>
              <div><dt className="text-xs text-gray-500">Created</dt><dd className="text-sm text-white">{new Date(tenant.createdAt).toLocaleDateString()}</dd></div>
              <div><dt className="text-xs text-gray-500">Last Updated</dt><dd className="text-sm text-white">{new Date(tenant.updatedAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Tenant Profile</h2>
            {!editProfile && (
              <button onClick={() => setEditProfile(true)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400 hover:text-white">
                Edit Profile
              </button>
            )}
          </div>
          {editProfile ? (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Description", key: "description", multiline: true },
                  { label: "Year Established", key: "yearEstablished", type: "number" },
                  { label: "Mission", key: "mission", multiline: true },
                  { label: "Vision", key: "vision", multiline: true },
                  { label: "Objectives", key: "objectives", multiline: true },
                  { label: "Website", key: "website", type: "url" },
                ].map((f) => (
                  <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                    <label className="form-label">{f.label}</label>
                    {f.multiline ? (
                      <textarea
                        value={(profileForm as any)[f.key] || ""}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="form-input min-h-[80px] resize-y"
                      />
                    ) : (
                      <input
                        type={f.type || "text"}
                        value={(profileForm as any)[f.key] || ""}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                        className="form-input"
                      />
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="form-label">Social Media Links (one per line)</label>
                  <textarea
                    value={(profileForm.socialMediaLinks || []).join("\n")}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, socialMediaLinks: e.target.value.split("\n").filter(Boolean) }))}
                    className="form-input min-h-[80px] resize-y"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={handleSaveProfile} disabled={updating} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                  <Save className="h-4 w-4" /> Save Profile
                </button>
                <button onClick={() => { setEditProfile(false); setProfileForm(profile || {}) }} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {profile ? (
                <>
                  <div><dt className="text-xs text-gray-500">Description</dt><dd className="mt-1 text-sm text-white">{profile.description || "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Year Established</dt><dd className="mt-1 text-sm text-white">{profile.yearEstablished || "—"}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs text-gray-500">Mission</dt><dd className="mt-1 text-sm text-white">{profile.mission || "—"}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs text-gray-500">Vision</dt><dd className="mt-1 text-sm text-white">{profile.vision || "—"}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs text-gray-500">Objectives</dt><dd className="mt-1 text-sm text-white">{profile.objectives || "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Website</dt><dd className="mt-1 text-sm text-white">{profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#3CA4F9] hover:underline">{profile.website}</a> : "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Social Media</dt><dd className="mt-1 text-sm text-white">{profile.socialMediaLinks?.length ? profile.socialMediaLinks.map((l, i) => <div key={i}><a href={l} target="_blank" rel="noopener noreferrer" className="text-[#3CA4F9] hover:underline">{l}</a></div>) : "—"}</dd></div>
                </>
              ) : (
                <p className="col-span-2 text-sm text-gray-500">No profile information yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "branding" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Branding</h2>
            {!editBranding && (
              <button onClick={() => setEditBranding(true)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400 hover:text-white">
                Edit Branding
              </button>
            )}
          </div>
          {editBranding ? (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Logo URL", key: "logo" },
                  { label: "Cover Image URL", key: "coverImage" },
                  { label: "Primary Color", key: "primaryColor", type: "color" },
                  { label: "Secondary Color", key: "secondaryColor", type: "color" },
                  { label: "Accent Color", key: "accentColor", type: "color" },
                  { label: "Typography", key: "typography" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input
                      type={f.type || "text"}
                      value={(brandingForm as any)[f.key] || ""}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={handleSaveBranding} disabled={updating} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                  <Save className="h-4 w-4" /> Save Branding
                </button>
                <button onClick={() => { setEditBranding(false); setBrandingForm(branding || {}) }} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {branding ? (
                <>
                  <div><dt className="text-xs text-gray-500">Logo</dt><dd className="mt-1 text-sm text-white">{branding.logo ? <img src={branding.logo} alt="Logo" className="h-12 w-12 rounded-lg object-cover" /> : "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Cover Image</dt><dd className="mt-1 text-sm text-white">{branding.coverImage ? <img src={branding.coverImage} alt="Cover" className="h-20 w-full rounded-lg object-cover" /> : "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Primary Color</dt><dd className="mt-1 flex items-center gap-2 text-sm text-white">{branding.primaryColor ? <><span className="inline-block h-4 w-4 rounded-full border border-[#1e3a5f]" style={{ backgroundColor: branding.primaryColor }} />{branding.primaryColor}</> : "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Secondary Color</dt><dd className="mt-1 flex items-center gap-2 text-sm text-white">{branding.secondaryColor ? <><span className="inline-block h-4 w-4 rounded-full border border-[#1e3a5f]" style={{ backgroundColor: branding.secondaryColor }} />{branding.secondaryColor}</> : "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Accent Color</dt><dd className="mt-1 flex items-center gap-2 text-sm text-white">{branding.accentColor ? <><span className="inline-block h-4 w-4 rounded-full border border-[#1e3a5f]" style={{ backgroundColor: branding.accentColor }} />{branding.accentColor}</> : "—"}</dd></div>
                  <div><dt className="text-xs text-gray-500">Typography</dt><dd className="mt-1 text-sm text-white">{branding.typography || "—"}</dd></div>
                </>
              ) : (
                <p className="col-span-2 text-sm text-gray-500">No branding information yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "lifecycle" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Lifecycle Management</h2>
            <div className="flex flex-wrap gap-3">
              {(tenant.commercialStatus === "prospect" || tenant.commercialStatus === "onboarding") && (
                <button onClick={() => handleLifecycleAction("activate")} disabled={updating} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                  Activate Tenant
                </button>
              )}
              {(tenant.commercialStatus === "active" || tenant.commercialStatus === "trial") && (
                <button onClick={() => handleLifecycleAction("suspend")} disabled={updating} className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50">
                  Suspend Tenant
                </button>
              )}
              {(tenant.commercialStatus === "suspended" || tenant.commercialStatus === "past_due") && (
                <button onClick={() => handleLifecycleAction("reactivate")} disabled={updating} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  Reactivate Tenant
                </button>
              )}
              {tenant.commercialStatus !== "archived" && tenant.commercialStatus !== "cancelled" && (
                <button onClick={() => handleLifecycleAction("archive")} disabled={updating} className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50">
                  Archive Tenant
                </button>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Current Status</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B]/50 p-4">
                <p className="text-xs text-gray-500">Lifecycle</p>
                <p className="mt-1"><StatusBadge status={tenant.status} variant="tenant" /></p>
              </div>
              <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B]/50 p-4">
                <p className="text-xs text-gray-500">Commercial</p>
                <p className="mt-1">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    commercialVariant === "active" ? "border-green-500/30 bg-green-500/10 text-green-400" :
                    commercialVariant === "trial" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
                    commercialVariant === "warning" ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" :
                    commercialVariant === "inactive" ? "border-gray-500/30 bg-gray-500/10 text-gray-400" :
                    "border-[#1e3a5f] text-gray-400"
                  }`}>{tenant.commercialStatus}</span>
                </p>
              </div>
              <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B]/50 p-4">
                <p className="text-xs text-gray-500">Plan</p>
                <p className="mt-1 text-sm capitalize text-white">{tenant.plan}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
