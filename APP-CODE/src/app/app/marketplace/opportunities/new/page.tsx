"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin"
import { getOpportunityService } from "@/lib/services"
import { OPPORTUNITY_TYPES, OPPORTUNITY_TYPE_LABELS } from "@/lib/constants"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function NewOpportunityPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    opportunityType: "employment",
    title: "",
    description: "",
    requirements: "",
    location: "",
    applicationDeadline: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      const svc = await getOpportunityService()
      await svc.createOpportunity({
        tenantId: "tenant-1",
        memberId: "admin",
        opportunityType: form.opportunityType as never,
        title: form.title,
        description: form.description,
        requirements: form.requirements.split("\n").filter((r) => r.trim()),
        location: form.location,
        applicationDeadline: form.applicationDeadline || undefined,
        status: "open",
      })
      router.push("/app/marketplace/opportunities")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create opportunity")
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="New Opportunity"
          description="Create a new employment, apprenticeship or business opportunity"
          actions={
            <Link href="/app/marketplace/opportunities" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      {error && (
        <motion.div variants={itemVariants} className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</motion.div>
      )}

      <motion.div variants={itemVariants}>
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-400">Opportunity Type</label>
              <select value={form.opportunityType} onChange={(e) => setForm({ ...form, opportunityType: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" required>
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t} value={t}>{OPPORTUNITY_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-400">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" placeholder="e.g. Senior Software Engineer" required />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-400">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" placeholder="Describe the opportunity in detail" required />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-400">Requirements (one per line)</label>
              <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={4} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience&#10;Strong communication skills" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" placeholder="e.g. Accra, Ghana" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Application Deadline</label>
              <input type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Create Opportunity"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
