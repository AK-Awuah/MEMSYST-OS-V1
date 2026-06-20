"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getProgramService } from "@/lib/services"

export default function NewProgramPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [levels, setLevels] = useState("")
  const [requirements, setRequirements] = useState("")
  const [completionRules, setCompletionRules] = useState("")

  const handleSubmit = async () => {
    if (!name || !description) return
    setSubmitting(true)
    try {
      const svc = await getProgramService()
      await svc.createProgram({
        tenantId: "tenant-1",
        name,
        description,
        levels: levels ? levels.split("\n").map((l) => l.trim()).filter(Boolean) : [],
        requirements: requirements ? requirements.split("\n").map((r) => r.trim()).filter(Boolean) : [],
        completionRules: completionRules ? completionRules.split("\n").map((r) => r.trim()).filter(Boolean) : [],
        status: "active",
      })
      router.push("/app/training/programs")
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Program Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter program name"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the program"
            rows={4}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Levels (one per line)</label>
          <textarea
            value={levels}
            onChange={(e) => setLevels(e.target.value)}
            placeholder="Beginner&#10;Intermediate&#10;Advanced"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Requirements (one per line)</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Must be a registered member&#10;Valid medical license"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Completion Rules (one per line)</label>
          <textarea
            value={completionRules}
            onChange={(e) => setCompletionRules(e.target.value)}
            placeholder="Complete all required courses&#10;Pass final examination"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !name || !description}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Program"}
        </button>
      </div>
    </div>
  )
}
