"use client"

import type { Tenant, TenantBranding } from "@/types"
import { useState, useEffect } from "react"
import { getTenantManagementService } from "@/lib/services"
import { Save, Loader2 } from "lucide-react"

export function BrandingTab({ tenant }: { tenant: Tenant }) {
  const [branding, setBranding] = useState<TenantBranding | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    logo: "",
    coverImage: "",
    primaryColor: "#3CA4F9",
    secondaryColor: "#1e3a5f",
    accentColor: "#fbbc04",
    typography: "Inter",
  })

  useEffect(() => {
    getTenantManagementService().then((svc) =>
      svc.getBranding(tenant.id).then((data) => {
        if (data) {
          setBranding(data)
          setForm({
            logo: data.logo,
            coverImage: data.coverImage,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            accentColor: data.accentColor,
            typography: data.typography,
          })
        }
        setLoading(false)
      })
    )
  }, [tenant.id])

  async function handleSave() {
    setSaving(true)
    const svc = await getTenantManagementService()
    await svc.updateBranding(tenant.id, form)
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Branding Configuration</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Logo URL</label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
              className="form-input"
              placeholder="https://example.com/logo.png"
            />
            {form.logo && (
              <img src={form.logo} alt="Logo preview" className="mt-2 h-12 w-auto rounded border border-[#1e3a5f]" />
            )}
          </div>
          <div>
            <label className="form-label">Cover Image URL</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
              className="form-input"
              placeholder="https://example.com/cover.png"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ColorField label="Primary Color" value={form.primaryColor} onChange={(v) => setForm((f) => ({ ...f, primaryColor: v }))} />
          <ColorField label="Secondary Color" value={form.secondaryColor} onChange={(v) => setForm((f) => ({ ...f, secondaryColor: v }))} />
          <ColorField label="Accent Color" value={form.accentColor} onChange={(v) => setForm((f) => ({ ...f, accentColor: v }))} />
        </div>

        <div className="mt-4">
          <label className="form-label">Typography</label>
          <select
            value={form.typography}
            onChange={(e) => setForm((f) => ({ ...f, typography: e.target.value }))}
            className="form-input"
          >
            {["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "System Default"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
          <span className="text-sm text-gray-400">Preview:</span>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: form.primaryColor }}>A</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: form.secondaryColor }}>B</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: form.accentColor }}>C</div>
            <span className="text-sm text-gray-300" style={{ fontFamily: form.typography }}>{form.typography}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Branding"}
          </button>
        </div>
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded border border-[#1e3a5f] bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-input flex-1 font-mono text-sm uppercase"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
