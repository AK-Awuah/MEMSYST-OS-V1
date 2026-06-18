"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, XCircle, AlertTriangle, AlertCircle, ShieldOff, IdCard, FileText, Building2, User, Calendar, Hash, BadgeCheck, Clock, Search, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCredentialVerificationService } from "@/lib/services"
import type { VerificationResult } from "@/lib/services/ICredentialVerificationService"

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  valid: { label: "Valid", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 },
  expired: { label: "Expired", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: AlertTriangle },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10", icon: XCircle },
  suspended: { label: "Suspended", color: "text-orange-400", bg: "bg-orange-500/10", icon: AlertCircle },
  invalid: { label: "Invalid", color: "text-gray-400", bg: "bg-gray-500/10", icon: ShieldOff },
}

const credentialTypeLabel: Record<string, string> = {
  id_card: "ID Card",
  certificate: "Certificate",
}

const credentialTypeIcon: Record<string, typeof IdCard> = {
  id_card: IdCard,
  certificate: FileText,
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function VerificationResultCard({ result }: { result: VerificationResult }) {
  const cfg = statusConfig[result.status] ?? statusConfig.invalid
  const StatusIcon = cfg.icon
  const TypeIcon = credentialTypeIcon[result.credentialType] ?? FileText
  const verifiedAt = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Status Badge */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`flex items-center gap-3 ${cfg.bg} ${cfg.color} px-5 py-3 rounded-2xl mb-6 border border-current/20`}
      >
        <StatusIcon className="w-6 h-6" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider">{cfg.label}</p>
          <p className="text-xs opacity-70">Credential Verification</p>
        </div>
        {result.status === "valid" && (
          <div className="ml-auto">
            <BadgeCheck className="w-8 h-8 text-green-400" />
          </div>
        )}
      </motion.div>

      {/* Credential Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-2xl border border-white/5 bg-[#0A1E2E] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center">
            <TypeIcon className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{credentialTypeLabel[result.credentialType] ?? result.credentialType}</p>
            <p className="text-lg font-semibold text-white">{result.credentialNumber}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4">
          <FieldRow icon={User} label="Holder Name" value={result.holderName} />
          <FieldRow icon={Building2} label="Organization" value={result.organization} />
          <FieldRow icon={Calendar} label="Issue Date" value={formatDate(result.issueDate)} />
          {result.expiryDate && <FieldRow icon={Clock} label="Expiry Date" value={formatDate(result.expiryDate)} />}
          <FieldRow icon={Hash} label="Credential Number" value={result.credentialNumber} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Verified by MemSyst • {verifiedAt}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FieldRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState("")
  const [manualCode, setManualCode] = useState("")
  const [verifying, setVerifying] = useState(false)

  async function verify(codeToVerify: string) {
    setVerifying(true)
    setError("")
    setResult(null)
    try {
      const svc = await getCredentialVerificationService()
      const res = await svc.verifyByCode(codeToVerify)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credential not found or verification failed.")
    } finally {
      setVerifying(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (code) {
      verify(code)
    } else {
      setLoading(false)
    }
  }, [code])

  function handleManualVerify(e: React.FormEvent) {
    e.preventDefault()
    if (manualCode.trim()) {
      router.replace(`/verify/${manualCode.trim()}`)
    }
  }

  return (
    <main className="min-h-screen bg-[#011B2B] text-[var(--foreground)] flex items-center justify-center">
      {/* Background Glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-lg px-4 py-16 relative z-10">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <Image src="/images/Small-logo.png" alt="MemSyst" width={40} height={40} className="object-contain" unoptimized />
            </div>
            <span className="text-2xl font-bold text-[var(--primary)]">MEMSYST</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Credential Verification</h1>
          <p className="text-sm text-gray-400">Verify the authenticity of any MemSyst credential</p>
        </motion.div>

        {/* Loading */}
        {(loading || verifying) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 p-10 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white">Verifying Credential</h2>
            <p className="text-sm text-gray-400">Please wait while we verify the authenticity of this credential.</p>
          </motion.div>
        )}

        {/* Error */}
        {!verifying && !loading && error && !result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 p-10 rounded-2xl border border-red-500/30 bg-red-500/5"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <ShieldOff className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Verification Failed</h2>
            <p className="text-sm text-red-300">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/verify")}
              className="mt-4"
            >
              Try Another Code
            </Button>
          </motion.div>
        )}

        {/* Result */}
        {!verifying && !loading && result && !error && <VerificationResultCard result={result} />}

        {/* No code — manual input */}
        {!code && !verifying && !loading && !result && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-8 rounded-2xl border border-white/5 bg-[#0A1E2E]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center">
                <Search className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Enter Verification Code</h2>
                <p className="text-sm text-gray-400">Paste the code from the credential</p>
              </div>
            </div>
            <form onSubmit={handleManualVerify} className="space-y-4">
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MEM-CERT-ABCD-1234"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full text-base" disabled={!manualCode.trim()}>
                Verify Credential
              </Button>
            </form>
          </motion.div>
        )}

        {/* Another verification link */}
        {result && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => { setResult(null); setError(""); router.push("/verify") }}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Verify Another Credential
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
