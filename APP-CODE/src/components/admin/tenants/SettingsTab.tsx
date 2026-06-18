"use client"

import type { Tenant, TenantSettings, MembershipCategory } from "@/types"
import { useState, useEffect } from "react"
import { getTenantSettingsService } from "@/lib/services"
import { Loader2, Save, Plus, X } from "lucide-react"

export function SettingsTab({ tenant }: { tenant: Tenant }) {
  const [settings, setSettings] = useState<TenantSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [subTab, setSubTab] = useState<"general" | "membership">("membership")
  const [generalForm, setGeneralForm] = useState({ locale: "", timezone: "", dateFormat: "", currency: "" })
  const [membershipForm, setMembershipForm] = useState({
    categories: [] as MembershipCategory[],
    registrationRequirements: "",
    approvalRules: "",
    renewalRules: "",
  })
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [catForm, setCatForm] = useState({ name: "", description: "", requiresApproval: false, renewalPeriodMonths: 12, fee: 0 })

  useEffect(() => {
    loadData()
  }, [tenant.id])

  async function loadData() {
    const svc = await getTenantSettingsService()
    const s = await svc.getSettings(tenant.id)
    if (s) {
      setSettings(s)
      setGeneralForm({
        locale: (s.general?.locale as string) || "",
        timezone: (s.general?.timezone as string) || "",
        dateFormat: (s.general?.dateFormat as string) || "",
        currency: (s.finance?.currency as string) || "",
      })
      setMembershipForm({
        categories: s.membership.categories || [],
        registrationRequirements: (s.membership.registrationRequirements || []).join("\n"),
        approvalRules: (s.membership.approvalRules || []).join("\n"),
        renewalRules: (s.membership.renewalRules || []).join("\n"),
      })
    }
    setLoading(false)
  }

  async function handleSaveGeneral() {
    setSaving(true)
    const svc = await getTenantSettingsService()
    await svc.updateSettings(tenant.id, {
      general: { locale: generalForm.locale, timezone: generalForm.timezone, dateFormat: generalForm.dateFormat },
      finance: { currency: generalForm.currency },
    } as any)
    setSaving(false)
  }

  async function handleSaveMembership() {
    setSaving(true)
    const svc = await getTenantSettingsService()
    await svc.updateMembershipConfig(tenant.id, {
      categories: membershipForm.categories,
      registrationRequirements: membershipForm.registrationRequirements.split("\n").filter(Boolean),
      approvalRules: membershipForm.approvalRules.split("\n").filter(Boolean),
      renewalRules: membershipForm.renewalRules.split("\n").filter(Boolean),
    })
    setSaving(false)
  }

  function handleAddCategory() {
    if (!catForm.name) return
    setMembershipForm((f) => ({
      ...f,
      categories: [...f.categories, { ...catForm, id: `mc-${Date.now()}` }],
    }))
    setCatForm({ name: "", description: "", requiresApproval: false, renewalPeriodMonths: 12, fee: 0 })
    setShowCategoryForm(false)
  }

  function handleRemoveCategory(id: string) {
    setMembershipForm((f) => ({ ...f, categories: f.categories.filter((c) => c.id !== id) }))
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[#1e3a5f]">
        <button onClick={() => setSubTab("membership")} className={`pb-2 text-sm font-medium ${subTab === "membership" ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}>
          Membership Framework
        </button>
        <button onClick={() => setSubTab("general")} className={`pb-2 text-sm font-medium ${subTab === "general" ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}>
          General Settings
        </button>
      </div>

      {subTab === "membership" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Membership Categories</h3>
            <button onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]"
            >
              <Plus className="h-3 w-3" /> Add Category
            </button>
          </div>

          {showCategoryForm && (
            <div className="mb-4 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="form-label text-xs">Category Name</label>
                  <input value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))} className="form-input text-sm" placeholder="e.g. Full Member" />
                </div>
                <div>
                  <label className="form-label text-xs">Renewal Period (months)</label>
                  <input type="number" value={catForm.renewalPeriodMonths} onChange={(e) => setCatForm((f) => ({ ...f, renewalPeriodMonths: parseInt(e.target.value) || 0 }))} className="form-input text-sm" />
                </div>
                <div>
                  <label className="form-label text-xs">Fee</label>
                  <input type="number" value={catForm.fee} onChange={(e) => setCatForm((f) => ({ ...f, fee: parseInt(e.target.value) || 0 }))} className="form-input text-sm" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input type="checkbox" checked={catForm.requiresApproval} onChange={(e) => setCatForm((f) => ({ ...f, requiresApproval: e.target.checked }))} className="rounded border-gray-600" />
                    Requires Approval
                  </label>
                </div>
              </div>
              <div className="mt-2">
                <label className="form-label text-xs">Description</label>
                <textarea value={catForm.description} onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))} className="form-input text-sm min-h-[60px]" rows={2} />
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleAddCategory} disabled={!catForm.name} className="rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Add</button>
                <button onClick={() => setShowCategoryForm(false)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400">Cancel</button>
              </div>
            </div>
          )}

          {membershipForm.categories.length === 0 ? (
            <p className="mb-4 text-sm text-gray-500">No membership categories defined.</p>
          ) : (
            <div className="mb-6 space-y-2">
              {membershipForm.categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-3">
                  <div>
                    <span className="text-sm font-medium text-white">{cat.name}</span>
                    <span className="ml-2 text-xs text-gray-500">{cat.description}</span>
                    <div className="mt-1 flex gap-3 text-xs text-gray-600">
                      <span>Fee: ${cat.fee}</span>
                      <span>Renewal: {cat.renewalPeriodMonths}mo</span>
                      {cat.requiresApproval && <span className="text-yellow-400">Requires approval</span>}
                    </div>
                  </div>
                  <button onClick={() => handleRemoveCategory(cat.id)} className="text-red-400 hover:text-red-300"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="form-label">Registration Requirements (one per line)</label>
              <textarea value={membershipForm.registrationRequirements} onChange={(e) => setMembershipForm((f) => ({ ...f, registrationRequirements: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="Valid medical license&#10;Proof of identity&#10;Two references" />
            </div>
            <div>
              <label className="form-label">Approval Rules (one per line)</label>
              <textarea value={membershipForm.approvalRules} onChange={(e) => setMembershipForm((f) => ({ ...f, approvalRules: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="Branch committee reviews application&#10;Regional chairperson approves" />
            </div>
            <div>
              <label className="form-label">Renewal Rules (one per line)</label>
              <textarea value={membershipForm.renewalRules} onChange={(e) => setMembershipForm((f) => ({ ...f, renewalRules: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="Renewal notice sent 60 days before expiry&#10;Late renewal fee applies after 30 days" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveMembership} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Membership Config"}
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === "general" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">General Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Locale</label>
              <input value={generalForm.locale} onChange={(e) => setGeneralForm((f) => ({ ...f, locale: e.target.value }))} className="form-input" placeholder="en-GH" />
            </div>
            <div>
              <label className="form-label">Timezone</label>
              <input value={generalForm.timezone} onChange={(e) => setGeneralForm((f) => ({ ...f, timezone: e.target.value }))} className="form-input" placeholder="Africa/Accra" />
            </div>
            <div>
              <label className="form-label">Date Format</label>
              <input value={generalForm.dateFormat} onChange={(e) => setGeneralForm((f) => ({ ...f, dateFormat: e.target.value }))} className="form-input" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <input value={generalForm.currency} onChange={(e) => setGeneralForm((f) => ({ ...f, currency: e.target.value }))} className="form-input" placeholder="GHS" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSaveGeneral} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
