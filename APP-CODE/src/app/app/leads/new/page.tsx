"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { getLeadsService } from "@/lib/services"
import { ArrowLeft } from "lucide-react"

export default function NewLeadPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    organizationName: "", contactPerson: "", email: "", phone: "",
    organizationType: "association", country: "", expectedMembers: 0,
    website: "", leadSource: "direct", estimatedValue: 0,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.organizationName || !form.contactPerson || !form.email) {
      setError("Organization Name, Contact Person, and Email are required.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const svc = await getLeadsService()
      await svc.createLead({
        ...form,
        status: "new",
      })
      router.push("/app/leads")
    } catch {
      setError("Failed to create lead. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="New Lead"
        description="Create a new prospect record"
        actions={
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Organization Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Organization Name *</label>
              <input className="form-input" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} placeholder="e.g. Ghana Hairdressers Association" />
            </div>
            <div>
              <label className="form-label">Organization Type</label>
              <select className="form-input" value={form.organizationType} onChange={(e) => setForm({ ...form, organizationType: e.target.value })}>
                <option value="association">Association</option>
                <option value="professional_body">Professional Body</option>
                <option value="cooperative">Cooperative</option>
                <option value="union">Union</option>
                <option value="ngo">NGO</option>
                <option value="federation">Federation</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Country</label>
              <input className="form-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Ghana" />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input className="form-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="e.g. https://ghaba.org" />
            </div>
            <div>
              <label className="form-label">Expected Members</label>
              <input type="number" className="form-input" value={form.expectedMembers || ""} onChange={(e) => setForm({ ...form, expectedMembers: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="form-label">Estimated Value (GH₵)</label>
              <input type="number" className="form-input" value={form.estimatedValue || ""} onChange={(e) => setForm({ ...form, estimatedValue: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Contact Person *</label>
              <input className="form-input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. john@ghaba.org" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +233 20 000 0000" />
            </div>
            <div>
              <label className="form-label">Lead Source</label>
              <select className="form-input" value={form.leadSource} onChange={(e) => setForm({ ...form, leadSource: e.target.value })}>
                <option value="direct">Direct</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="linkedin">LinkedIn</option>
                <option value="google">Google</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-[#3CA4F9] px-6 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
            {saving ? "Creating..." : "Create Lead"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-[#1e3a5f] px-6 py-2 text-sm text-gray-400 hover:text-white">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
