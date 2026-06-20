"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getIntegrationService } from "@/lib/services"

export default function NewAPIKeyPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState("")
  const [permissions, setPermissions] = useState("")
  const [rateLimit, setRateLimit] = useState("100")
  const [allowedIPs, setAllowedIPs] = useState("")
  const [expiresAt, setExpiresAt] = useState("")

  const handleSubmit = async () => {
    if (!name) return
    setSubmitting(true)
    try {
      const svc = await getIntegrationService()
      await svc.createAPIKey({
        tenantId: "tenant-1",
        name,
        permissions: permissions ? permissions.split(",").map((p) => p.trim()) : [],
        allowedIPs: allowedIPs ? allowedIPs.split(",").map((ip) => ip.trim()) : [],
        rateLimit: parseInt(rateLimit, 10),
        status: "active",
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        createdBy: "admin-1",
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/integration/api-keys"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create API key")
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
        <p className="text-lg font-medium text-white">API key created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to API Keys
      </button>
      <PageHeader title="New API Key" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Key name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Permissions (comma-separated)</label>
          <input type="text" value={permissions} onChange={(e) => setPermissions(e.target.value)} placeholder="read, write, admin" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Rate Limit (requests/hour)</label>
            <input type="number" value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} min="1" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Expires At (optional)</label>
            <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Allowed IPs (comma-separated, optional)</label>
          <input type="text" value={allowedIPs} onChange={(e) => setAllowedIPs(e.target.value)} placeholder="192.168.1.1, 10.0.0.1" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || !name}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create API Key"}
        </button>
      </div>
    </div>
  )
}
