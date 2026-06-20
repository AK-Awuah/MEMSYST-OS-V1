"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Settings } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getTrainingSettingsService } from "@/lib/services"
import type { TrainingSettings } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TrainingSettingsPage() {
  const [settings, setSettings] = useState<TrainingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTrainingSettingsService()
        const data = await svc.getSettings("tenant-1")
        if (!cancelled) setSettings(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load settings")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const svc = await getTrainingSettingsService()
      const updated = await svc.updateSettings("tenant-1", {
        programs: settings.programs,
        levels: settings.levels,
        assessmentRules: settings.assessmentRules,
        graduationRules: settings.graduationRules,
        certificationRules: settings.certificationRules,
        accreditationRules: settings.accreditationRules,
      })
      setSettings(updated)
      setSuccess("Training settings saved successfully.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading training settings...</p>
      </div>
    )
  }

  if (error && !settings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Settings" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Training Settings" />
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-400">No training settings found for this tenant.</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Training Settings"
          description="Configure training platform rules and options."
        />
      </motion.div>

      {success && (
        <motion.div variants={itemVariants} className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div variants={itemVariants} className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">Programs & Levels</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Programs (one per line)</label>
              <textarea
                value={settings.programs.join("\n")}
                onChange={(e) => setSettings({ ...settings, programs: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={4}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Levels (one per line)</label>
              <textarea
                value={settings.levels.join("\n")}
                onChange={(e) => setSettings({ ...settings, levels: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={4}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">Rules</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assessment Rules (one per line)</label>
              <textarea
                value={settings.assessmentRules.join("\n")}
                onChange={(e) => setSettings({ ...settings, assessmentRules: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={3}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Graduation Rules (one per line)</label>
              <textarea
                value={settings.graduationRules.join("\n")}
                onChange={(e) => setSettings({ ...settings, graduationRules: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={3}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Certification Rules (one per line)</label>
              <textarea
                value={settings.certificationRules.join("\n")}
                onChange={(e) => setSettings({ ...settings, certificationRules: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={3}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Accreditation Rules (one per line)</label>
              <textarea
                value={settings.accreditationRules.join("\n")}
                onChange={(e) => setSettings({ ...settings, accreditationRules: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={3}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </motion.div>
    </motion.div>
  )
}
