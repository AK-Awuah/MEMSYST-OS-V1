"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { SCHOLARSHIP_TYPES, SCHOLARSHIP_TYPE_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { ScholarshipType } from "@/types"

export default function NewScholarshipPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [scholarshipType, setScholarshipType] = useState<ScholarshipType>("merit")
  const [description, setDescription] = useState("")
  const [provider, setProvider] = useState("")
  const [amount, setAmount] = useState("")
  const [totalSlots, setTotalSlots] = useState("")
  const [eligibilityCriteria, setEligibilityCriteria] = useState("")
  const [requirements, setRequirements] = useState("")
  const [applicationDeadline, setApplicationDeadline] = useState("")

  const handleSubmit = async () => {
    if (!title || !description || !provider || !amount || !totalSlots || !applicationDeadline) return
    setSubmitting(true)
    try {
      const svc = await getSupportHubService()
      await svc.createScholarship({
        tenantId: "tenant-1",
        title,
        description,
        scholarshipType,
        provider,
        amount: parseFloat(amount),
        totalSlots: parseInt(totalSlots, 10),
        slotsFilled: 0,
        eligibilityCriteria: eligibilityCriteria.split("\n").filter(Boolean),
        requirements: requirements.split("\n").filter(Boolean),
        applicationDeadline,
        status: "draft",
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/support-hub/scholarships"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create scholarship")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Save className="h-8 w-8 text-green-400" />
        </div>
        <p className="text-lg font-medium text-white">Scholarship created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting to scholarships list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Scholarships
      </button>

      <PageHeader title="New Scholarship" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Scholarship title"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Scholarship Type</label>
            <select
              value={scholarshipType}
              onChange={(e) => setScholarshipType(e.target.value as ScholarshipType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {SCHOLARSHIP_TYPES.map((t) => (
                <option key={t} value={t}>{SCHOLARSHIP_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Provider</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Scholarship provider"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Total Slots</label>
            <input
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              placeholder="Number of slots"
              min="1"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Scholarship description"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Eligibility Criteria (one per line)</label>
          <textarea
            value={eligibilityCriteria}
            onChange={(e) => setEligibilityCriteria(e.target.value)}
            placeholder="Must be a registered member&#10;Minimum GPA of 3.0&#10;..."
            rows={4}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Requirements (one per line)</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Completed application form&#10;Academic transcripts&#10;..."
            rows={4}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Application Deadline</label>
          <input
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title || !description || !provider || !amount || !totalSlots || !applicationDeadline}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Scholarship"}
        </button>
      </div>
    </div>
  )
}
