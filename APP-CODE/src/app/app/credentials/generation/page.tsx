"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, CreditCard, Award, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getCredentialGenerationService } from "@/lib/services"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface TriggerOption {
  id: string
  label: string
  description: string
}

const triggers: TriggerOption[] = [
  { id: "member_approved", label: "Member Approved", description: "Generate ID card when a member is approved" },
  { id: "apprentice_upgraded", label: "Apprentice Upgraded", description: "Generate ID card when an apprentice is upgraded to member" },
  { id: "training_completed", label: "Training Completed", description: "Generate certificate when training is completed" },
  { id: "executive_appointed", label: "Executive Appointed", description: "Generate ID card when an executive is appointed" },
  { id: "certificate_approved", label: "Certificate Approved", description: "Generate certificate when approval is granted" },
]

export default function GenerationPage() {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
  const [ownerId, setOwnerId] = useState("")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!selectedTrigger || !ownerId) return
    setGenerating(true)
    setResult(null)
    setError(null)
    try {
      const svc = await getCredentialGenerationService()
      if (selectedTrigger === "training_completed" || selectedTrigger === "certificate_approved") {
        await svc.generateCertificate(selectedTrigger as any, ownerId, "tenant-1", selectedTrigger)
      } else {
        await svc.generateIDCard(selectedTrigger as any, ownerId, "tenant-1")
      }
      setResult("Credential generated successfully")
      setOwnerId("")
      setSelectedTrigger(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Credential Generation"
          description="Manually trigger credential generation"
          actions={
            <Link
              href="/app/credentials"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Credentials
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 p-6 backdrop-blur-md">
        <h2 className="mb-4 text-lg font-semibold text-white">Generation Triggers</h2>
        <p className="mb-6 text-sm text-gray-400">Select a trigger event and provide the owner ID to generate a credential.</p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {triggers.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrigger(t.id)}
              className={`rounded-lg border p-4 text-left transition-all ${
                selectedTrigger === t.id
                  ? "border-[#3CA4F9] bg-[#3CA4F9]/10"
                  : "border-[#1e3a5f] bg-[#012a42]/50 hover:border-[#3CA4F9]/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className={`h-4 w-4 ${selectedTrigger === t.id ? "text-[#3CA4F9]" : "text-gray-500"}`} />
                <span className="text-sm font-medium text-white">{t.label}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{t.description}</p>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Owner / Recipient ID</label>
          <input
            type="text"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            placeholder="Enter member ID, apprentice ID, or training ID..."
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedTrigger || !ownerId || generating}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3CA4F9]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating ? (
            <><RefreshCw className="h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            <><Zap className="h-4 w-4" /> Generate Credential</>
          )}
        </button>

        {result && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            {result}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
