"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { getSettingsService } from "@/lib/services"
import type { PlatformSettings } from "@/lib/services/ISettingsService"
import { Save } from "lucide-react"

const defaults: PlatformSettings = {
  organizationName: "MemSyst",
  supportEmail: "support@memsyst.com",
  notificationEmail: "notifications@memsyst.com",
  autoAssignLeads: true,
  leadAssignmentRule: "round-robin",
  defaultLeadStatus: "new",
  crmDefaultProbability: "10",
  requireApprovalForTenants: true,
  auditRetentionDays: "365",
  emailNotifications: true,
  leadNotifications: true,
  crmNotifications: true,
  auditDigest: false,
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<PlatformSettings>(defaults)

  useEffect(() => {
    getSettingsService().then((svc) =>
      svc.getSettings().then((data) => {
        if (data) setSettings(data)
        setLoading(false)
      })
    )
  }, [])

  async function handleSave() {
    const svc = await getSettingsService()
    await svc.updateSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Configure platform behavior" />

      <div className="space-y-6">
        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Organization</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="form-label">Organization Name</label><input className="form-input" value={settings.organizationName} onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })} /></div>
            <div><label className="form-label">Support Email</label><input className="form-input" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} /></div>
            <div><label className="form-label">Notification Email</label><input className="form-input" value={settings.notificationEmail} onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })} /></div>
          </div>
        </section>

        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Lead & CRM</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="form-label">Default Lead Status</label>
              <select className="form-input" value={settings.defaultLeadStatus} onChange={(e) => setSettings({ ...settings, defaultLeadStatus: e.target.value })}>
                <option value="new">New</option><option value="qualified">Qualified</option>
              </select>
            </div>
            <div><label className="form-label">CRM Default Probability (%)</label><input className="form-input" value={settings.crmDefaultProbability} onChange={(e) => setSettings({ ...settings, crmDefaultProbability: e.target.value })} /></div>
            <div><label className="form-label">Lead Assignment Rule</label>
              <select className="form-input" value={settings.leadAssignmentRule} onChange={(e) => setSettings({ ...settings, leadAssignmentRule: e.target.value as "round-robin" | "manual" })}>
                <option value="round-robin">Round Robin</option><option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="autoAssign" checked={settings.autoAssignLeads} onChange={(e) => setSettings({ ...settings, autoAssignLeads: e.target.checked })} className="rounded border-gray-600 bg-[#011B2B]" />
              <label htmlFor="autoAssign" className="text-sm text-gray-400">Auto-assign leads</label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="emailNotifs" checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} className="rounded border-gray-600 bg-[#011B2B]" />
              <label htmlFor="emailNotifs" className="text-sm text-gray-400">Email notifications for new submissions</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="leadNotifs" checked={settings.leadNotifications} onChange={(e) => setSettings({ ...settings, leadNotifications: e.target.checked })} className="rounded border-gray-600 bg-[#011B2B]" />
              <label htmlFor="leadNotifs" className="text-sm text-gray-400">Notify when leads are assigned</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="crmNotifs" checked={settings.crmNotifications} onChange={(e) => setSettings({ ...settings, crmNotifications: e.target.checked })} className="rounded border-gray-600 bg-[#011B2B]" />
              <label htmlFor="crmNotifs" className="text-sm text-gray-400">CRM opportunity stage changes</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="auditNotifs" checked={settings.auditDigest} onChange={(e) => setSettings({ ...settings, auditDigest: e.target.checked })} className="rounded border-gray-600 bg-[#011B2B]" />
              <label htmlFor="auditNotifs" className="text-sm text-gray-400">Daily audit summary digest</label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Tenant & Audit</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="requireApproval" checked={settings.requireApprovalForTenants} onChange={(e) => setSettings({ ...settings, requireApprovalForTenants: e.target.checked })} className="rounded border-gray-600 bg-[#011B2B]" />
              <label htmlFor="requireApproval" className="text-sm text-gray-400">Require approval for tenant creation</label>
            </div>
            <div><label className="form-label">Audit Log Retention (days)</label><input className="form-input" value={settings.auditRetentionDays} onChange={(e) => setSettings({ ...settings, auditRetentionDays: e.target.value })} /></div>
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
