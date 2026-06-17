"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { getOrganizationService } from "@/lib/services"
import { Check } from "lucide-react"

interface WizardData {
  organizationName: string
  shortName: string
  subdomain: string
  country: string
  industry: string
  logo: string
  primaryColor: string
  secondaryColor: string
  plan: string
  subscription: string
  commissionModel: string
  revenueDistributionModel: string
  adminName: string
  adminEmail: string
  adminPhone: string
}

const initialWizardData: WizardData = {
  organizationName: "", shortName: "", subdomain: "", country: "Ghana", industry: "",
  logo: "", primaryColor: "#3CA4F9", secondaryColor: "#01314E",
  plan: "Enterprise", subscription: "annual",
  commissionModel: "percentage", revenueDistributionModel: "shared",
  adminName: "", adminEmail: "", adminPhone: "",
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(initialWizardData)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError("")
    try {
      const svc = await getOrganizationService()
      await svc.onboardTenant({
        ...data,
        status: "setup",
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to onboard tenant")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-8 w-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Tenant Created Successfully</h2>
        <p className="mt-2 text-gray-400">{data.organizationName} has been onboarded as a tenant.</p>
        <button onClick={() => { setSuccess(false); setStep(1); setData(initialWizardData) }} className="mt-6 rounded-lg bg-[#3CA4F9] px-6 py-2 text-sm font-medium text-white">
          Onboard Another Organization
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Tenant Onboarding Wizard"
        description="Convert an approved organization into a MemSyst tenant"
      />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Organization" },
            { num: 2, label: "Branding" },
            { num: 3, label: "Commercial" },
            { num: 4, label: "Administrator" },
            { num: 5, label: "Activate" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step >= s.num ? "bg-[#3CA4F9] text-white" : "bg-[#1e3a5f] text-gray-500"
              }`}>
                {s.num}
              </div>
              <span className={`mt-1 text-xs ${step >= s.num ? "text-[#3CA4F9]" : "text-gray-600"}`}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 rounded-full bg-[#1e3a5f]">
          <div className="h-1 rounded-full bg-[#3CA4F9] transition-all" style={{ width: `${((step - 1) / 4) * 100}%` }} />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Organization Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="form-label">Organization Name</label><input className="form-input" value={data.organizationName} onChange={(e) => update("organizationName", e.target.value)} /></div>
              <div><label className="form-label">Short Name</label><input className="form-input" value={data.shortName} onChange={(e) => update("shortName", e.target.value)} placeholder="e.g. GMA" /></div>
              <div><label className="form-label">Subdomain</label><input className="form-input" value={data.subdomain} onChange={(e) => update("subdomain", e.target.value)} placeholder="e.g. gma" /></div>
              <div><label className="form-label">Country</label><input className="form-input" value={data.country} onChange={(e) => update("country", e.target.value)} /></div>
              <div><label className="form-label">Industry</label>
                <select className="form-input" value={data.industry} onChange={(e) => update("industry", e.target.value)}>
                  <option value="">Select...</option>
                  <option>Association</option><option>Professional Body</option><option>Trade Association</option>
                  <option>Cooperative</option><option>NGO</option><option>Federation</option><option>Union</option><option>Alumni Association</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Branding Configuration</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="form-label">Logo URL</label><input className="form-input" value={data.logo} onChange={(e) => update("logo", e.target.value)} placeholder="https://..." /></div>
              <div><label className="form-label">Primary Color</label><input type="color" className="h-10 w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] cursor-pointer" value={data.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} /></div>
              <div><label className="form-label">Secondary Color</label><input type="color" className="h-10 w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] cursor-pointer" value={data.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} /></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Commercial Setup</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="form-label">Plan</label>
                <select className="form-input" value={data.plan} onChange={(e) => update("plan", e.target.value)}>
                  <option>Starter</option><option>Growth</option><option>Enterprise</option>
                </select>
              </div>
              <div><label className="form-label">Subscription</label>
                <select className="form-input" value={data.subscription} onChange={(e) => update("subscription", e.target.value)}>
                  <option value="monthly">Monthly</option><option value="annual">Annual</option>
                </select>
              </div>
              <div><label className="form-label">Commission Model</label>
                <select className="form-input" value={data.commissionModel} onChange={(e) => update("commissionModel", e.target.value)}>
                  <option value="percentage">Percentage</option><option value="fixed">Fixed</option><option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div><label className="form-label">Revenue Distribution</label>
                <select className="form-input" value={data.revenueDistributionModel} onChange={(e) => update("revenueDistributionModel", e.target.value)}>
                  <option value="shared">Shared</option><option value="full">Full Tenant</option><option value="platform">Platform Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Administrator Account</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="form-label">Full Name</label><input className="form-input" value={data.adminName} onChange={(e) => update("adminName", e.target.value)} /></div>
              <div><label className="form-label">Email</label><input type="email" className="form-input" value={data.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} /></div>
              <div><label className="form-label">Phone</label><input className="form-input" value={data.adminPhone} onChange={(e) => update("adminPhone", e.target.value)} /></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Review & Activate</h3>
            <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
              <dl className="grid gap-2 sm:grid-cols-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="text-sm text-white">{String(value) || "-"}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="text-sm text-gray-400">
              This will create a tenant record and prepare the organization for platform access.
              The actual tenant platform will be activated in future stages.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between border-t border-[#1e3a5f] pt-6">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50"
          >
            Previous
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="rounded-lg bg-[#3CA4F9] px-6 py-2 text-sm font-medium text-white hover:bg-[#3594e0]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-green-500 px-6 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
            >
              {submitting ? "Creating Tenant..." : "Activate Tenant"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
