"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/admin"
import { getCredentialSettingsService } from "@/lib/services"
import type { CredentialSettings } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<CredentialSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCredentialSettingsService()
        const data = await svc.getSettings("tenant-1")
        if (!cancelled && data) setSettings(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load settings")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleChange = (field: keyof CredentialSettings, value: string | boolean | number) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = async () => {
    if (!settings) return
    try {
      setSaving(true)
      setSuccess(false)
      setError(null)
      const svc = await getCredentialSettingsService()
      await svc.updateSettings("tenant-1", settings)
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credential Settings" description="Configure credential system parameters" />
        <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-6 space-y-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded bg-[#1e3a5f] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error && !settings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credential Settings" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Credential Settings"
          description="Configure credential system parameters"
          actions={
            <Link
              href="/app/credentials"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-6">
        <div className="mb-6 flex items-center gap-2 border-b border-[#1e3a5f] pb-4">
          <Settings className="h-5 w-5 text-[#3CA4F9]" />
          <h2 className="text-lg font-semibold text-white">Credential Configuration</h2>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">ID Card Reprint Fee</label>
              <input
                type="number"
                value={settings.idCardReprintFee}
                onChange={(e) => handleChange("idCardReprintFee", Number(e.target.value))}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Certificate Reprint Fee</label>
              <input
                type="number"
                value={settings.certificateReprintFee}
                onChange={(e) => handleChange("certificateReprintFee", Number(e.target.value))}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">ID Card Expiry (months)</label>
              <input
                type="number"
                value={settings.idCardExpiryMonths}
                onChange={(e) => handleChange("idCardExpiryMonths", Number(e.target.value))}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Certificate Expiry (months)</label>
              <input
                type="number"
                value={settings.certificateExpiryMonths}
                onChange={(e) => handleChange("certificateExpiryMonths", Number(e.target.value))}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-[#1e3a5f] pt-5 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoGenerateOnApproval}
                onChange={(e) => handleChange("autoGenerateOnApproval", e.target.checked)}
                className="h-4 w-4 rounded border-[#1e3a5f] bg-[#011B2B] text-[#3CA4F9] focus:ring-[#3CA4F9]"
              />
              <span className="text-sm text-gray-300">Auto-generate credentials on member approval</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoGenerateOnUpgrade}
                onChange={(e) => handleChange("autoGenerateOnUpgrade", e.target.checked)}
                className="h-4 w-4 rounded border-[#1e3a5f] bg-[#011B2B] text-[#3CA4F9] focus:ring-[#3CA4F9]"
              />
              <span className="text-sm text-gray-300">Auto-generate credentials on apprentice upgrade</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.verificationRequiresAuth}
                onChange={(e) => handleChange("verificationRequiresAuth", e.target.checked)}
                className="h-4 w-4 rounded border-[#1e3a5f] bg-[#011B2B] text-[#3CA4F9] focus:ring-[#3CA4F9]"
              />
              <span className="text-sm text-gray-300">Require authentication for credential verification</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        {success && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">Settings saved successfully.</div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3591E0] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
