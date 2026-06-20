"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ScanLine, ArrowLeft, Search, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getCredentialVerificationService } from "@/lib/services"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface VerificationResult {
  status: string
  holderName: string
  organization: string
  issueDate: string
  expiryDate?: string
  credentialType: string
  credentialNumber: string
}

export default function VerificationPage() {
  const [code, setCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"code" | "number">("code")

  const handleVerify = async () => {
    if (!code.trim()) return
    setVerifying(true)
    setResult(null)
    setError(null)
    try {
      const svc = await getCredentialVerificationService()
      const data = mode === "code"
        ? await svc.verifyByCode(code.trim())
        : await svc.verifyByNumber(code.trim())
      setResult(data as VerificationResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed. Check the code and try again.")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Credential Verification"
          description="Verify ID cards and certificates by code or number"
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
        <h2 className="mb-4 text-lg font-semibold text-white">Verify a Credential</h2>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("code")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "code" ? "bg-[#3CA4F9] text-white" : "border border-[#1e3a5f] text-gray-400 hover:text-white"
            }`}
          >
            By Verification Code
          </button>
          <button
            onClick={() => setMode("number")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "number" ? "bg-[#3CA4F9] text-white" : "border border-[#1e3a5f] text-gray-400 hover:text-white"
            }`}
          >
            By Credential Number
          </button>
        </div>

        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder={mode === "code" ? "Enter verification code..." : "Enter credential number..."}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={!code.trim() || verifying}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3CA4F9]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
            Verify
          </button>
        </div>

        {result && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Credential Verified</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Holder Name</p>
                <p className="text-sm font-medium text-white">{result.holderName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Organization</p>
                <p className="text-sm font-medium text-white">{result.organization}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Credential Type</p>
                <p className="text-sm font-medium capitalize text-white">{result.credentialType.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Credential Number</p>
                <p className="text-sm font-mono font-medium text-white">{result.credentialNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Issue Date</p>
                <p className="text-sm font-medium text-white">{new Date(result.issueDate).toLocaleDateString()}</p>
              </div>
              {result.expiryDate && (
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm font-medium text-white">{new Date(result.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Verification Failed</p>
              <p className="mt-1 text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
