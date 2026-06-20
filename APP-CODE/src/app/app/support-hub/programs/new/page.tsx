"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  SUPPORT_PROGRAM_CATEGORIES,
  SUPPORT_PROGRAM_CATEGORY_LABELS,
} from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { SupportProgramCategory } from "@/types"

export default function NewProgramPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<SupportProgramCategory>("financial")
  const [description, setDescription] = useState("")
  const [provider, setProvider] = useState("")
  const [eligibilityCriteria, setEligibilityCriteria] = useState("")
  const [applicationProcess, setApplicationProcess] = useState("")
  const [benefits, setBenefits] = useState("")
  const [fundingSource, setFundingSource] = useState("")
  const [budget, setBudget] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [maxBeneficiaries, setMaxBeneficiaries] = useState("")

  const handleSubmit = async () => {
    if (!title || !provider || !budget || !startDate || !maxBeneficiaries) return
    setSubmitting(true)
    try {
      const svc = await getSupportHubService()
      await svc.createProgram({
        tenantId: "tenant-1",
        title,
        category,
        description,
        provider,
        eligibilityCriteria: eligibilityCriteria ? eligibilityCriteria.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        applicationProcess,
        benefits: benefits ? benefits.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        fundingSource,
        budget: parseFloat(budget),
        budgetSpent: 0,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        maxBeneficiaries: parseInt(maxBeneficiaries, 10),
        currentBeneficiaries: 0,
        status: "draft",
      })
      router.push("/app/support-hub/programs")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create program")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Programs
      </button>

      <PageHeader title="New Program" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Program title"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportProgramCategory)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {SUPPORT_PROGRAM_CATEGORIES.map((c) => (
                <option key={c} value={c}>{SUPPORT_PROGRAM_CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Provider</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Provider name"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Funding Source</label>
            <input
              type="text"
              value={fundingSource}
              onChange={(e) => setFundingSource(e.target.value)}
              placeholder="Source of funding"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Budget</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Beneficiaries</label>
            <input
              type="number"
              value={maxBeneficiaries}
              onChange={(e) => setMaxBeneficiaries(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the program"
            rows={4}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Eligibility Criteria (one per line)</label>
          <textarea
            value={eligibilityCriteria}
            onChange={(e) => setEligibilityCriteria(e.target.value)}
            placeholder="Must be an active member for 6+ months&#10;Proof of emergency required&#10;..."
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Application Process</label>
          <textarea
            value={applicationProcess}
            onChange={(e) => setApplicationProcess(e.target.value)}
            placeholder="Describe the application process"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Benefits (one per line)</label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Up to GHS 2,000 grant&#10;Counseling support&#10;..."
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title || !provider || !budget || !startDate || !maxBeneficiaries}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Program"}
        </button>
      </div>
    </div>
  )
}
