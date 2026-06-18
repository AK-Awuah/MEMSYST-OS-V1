"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { getFinancialSettingsService } from "@/lib/services"
import type { FinancialSettings } from "@/types"
import { Save } from "lucide-react"

export default function FinancialSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<FinancialSettings | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const svc = await getFinancialSettingsService()
        const data = await svc.getSettings("tenant-1")
        if (data) {
          setSettings(data)
        } else {
          setSettings(svc.getDefaultSettings())
        }
      } catch {
        setSettings({
          id: "fin-set-default",
          tenantId: "tenant-1",
          currency: "GHS",
          withdrawalFeePercent: 5,
          maxWithdrawalPercent: 80,
          monthlyWithdrawalLimit: 1,
          messagingCosts: { emailCost: 0.05, smsCost: 0.30, pushCost: 0.02 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave() {
    if (!settings) return
    const svc = await getFinancialSettingsService()
    await svc.updateSettings(settings.tenantId, settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading || !settings) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Financial Settings" description="Loading..." />
        <div className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Financial Settings" description="Configure platform financial parameters" />

      <div className="space-y-6">
        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">General</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Currency</label>
              <select className="form-input" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
                <option value="GHS">GHS (Ghana Cedi)</option>
                <option value="NGN">NGN (Nigerian Naira)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Monthly Withdrawal Limit</label>
              <input className="form-input" type="number" value={settings.monthlyWithdrawalLimit} onChange={(e) => setSettings({ ...settings, monthlyWithdrawalLimit: parseInt(e.target.value) || 1 })} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Withdrawal Fees</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Fee Percentage (%)</label>
              <input className="form-input" type="number" step="0.1" value={settings.withdrawalFeePercent} onChange={(e) => setSettings({ ...settings, withdrawalFeePercent: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="form-label">Max Withdrawal (%)</label>
              <input className="form-input" type="number" step="1" value={settings.maxWithdrawalPercent} onChange={(e) => setSettings({ ...settings, maxWithdrawalPercent: parseInt(e.target.value) || 80 })} />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Max withdrawal limits the percentage of available balance that can be withdrawn at once.</p>
        </section>

        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Messaging Costs</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label">Email Cost (GHS)</label>
              <input className="form-input" type="number" step="0.01" value={settings.messagingCosts.emailCost} onChange={(e) => setSettings({ ...settings, messagingCosts: { ...settings.messagingCosts, emailCost: parseFloat(e.target.value) || 0 } })} />
            </div>
            <div>
              <label className="form-label">SMS Cost (GHS)</label>
              <input className="form-input" type="number" step="0.01" value={settings.messagingCosts.smsCost} onChange={(e) => setSettings({ ...settings, messagingCosts: { ...settings.messagingCosts, smsCost: parseFloat(e.target.value) || 0 } })} />
            </div>
            <div>
              <label className="form-label">Push Cost (GHS)</label>
              <input className="form-input" type="number" step="0.01" value={settings.messagingCosts.pushCost} onChange={(e) => setSettings({ ...settings, messagingCosts: { ...settings.messagingCosts, pushCost: parseFloat(e.target.value) || 0 } })} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2 text-sm font-medium text-white hover:bg-[#3594e0]">
            <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  )
}
