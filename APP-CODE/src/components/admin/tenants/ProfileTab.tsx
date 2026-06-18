"use client"

import type { Tenant, TenantProfile } from "@/types"
import { useState, useEffect } from "react"
import { getTenantManagementService } from "@/lib/services"
import { Save, Loader2 } from "lucide-react"

interface ProfileTabProps {
  tenant: Tenant
}

export function ProfileTab({ tenant }: ProfileTabProps) {
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    yearEstablished: 0,
    description: "",
    mission: "",
    vision: "",
    objectives: "",
    website: "",
    socialMediaLinks: "",
  })

  useEffect(() => {
    getTenantManagementService().then((svc) =>
      svc.getProfile(tenant.id).then((data) => {
        if (data) {
          setProfile(data)
          setForm({
            yearEstablished: data.yearEstablished,
            description: data.description,
            mission: data.mission,
            vision: data.vision,
            objectives: data.objectives,
            website: data.website,
            socialMediaLinks: data.socialMediaLinks.join("\n"),
          })
        }
        setLoading(false)
      })
    )
  }, [tenant.id])

  async function handleSave() {
    setSaving(true)
    const svc = await getTenantManagementService()
    await svc.updateProfile(tenant.id, {
      yearEstablished: form.yearEstablished,
      description: form.description,
      mission: form.mission,
      vision: form.vision,
      objectives: form.objectives,
      website: form.website,
      socialMediaLinks: form.socialMediaLinks.split("\n").filter(Boolean),
    })
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Organization Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Year Established</label>
            <input
              type="number"
              value={form.yearEstablished || ""}
              onChange={(e) => setForm((f) => ({ ...f, yearEstablished: parseInt(e.target.value) || 0 }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="form-input"
              placeholder="https://example.org"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="form-label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="form-input min-h-[80px]"
            rows={3}
          />
        </div>
        <div className="mt-4">
          <label className="form-label">Mission</label>
          <textarea
            value={form.mission}
            onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))}
            className="form-input min-h-[80px]"
            rows={3}
          />
        </div>
        <div className="mt-4">
          <label className="form-label">Vision</label>
          <textarea
            value={form.vision}
            onChange={(e) => setForm((f) => ({ ...f, vision: e.target.value }))}
            className="form-input min-h-[80px]"
            rows={3}
          />
        </div>
        <div className="mt-4">
          <label className="form-label">Objectives</label>
          <textarea
            value={form.objectives}
            onChange={(e) => setForm((f) => ({ ...f, objectives: e.target.value }))}
            className="form-input min-h-[80px]"
            rows={3}
          />
        </div>
        <div className="mt-4">
          <label className="form-label">Social Media Links (one per line)</label>
          <textarea
            value={form.socialMediaLinks}
            onChange={(e) => setForm((f) => ({ ...f, socialMediaLinks: e.target.value }))}
            className="form-input min-h-[80px]"
            rows={3}
            placeholder="https://twitter.com/org&#10;https://linkedin.com/company/org"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  )
}
