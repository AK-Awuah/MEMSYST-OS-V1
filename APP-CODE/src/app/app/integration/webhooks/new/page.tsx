"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getIntegrationService } from "@/lib/services"

export default function NewWebhookPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [events, setEvents] = useState("")
  const [retryCount, setRetryCount] = useState("3")
  const [timeoutSec, setTimeoutSec] = useState("5")

  const handleSubmit = async () => {
    if (!name || !url || !events) return
    setSubmitting(true)
    try {
      const svc = await getIntegrationService()
      await svc.createWebhook({
        tenantId: "tenant-1",
        name,
        url,
        events: events.split(",").map((e) => e.trim()),
        secret: "",
        headers: {},
        retryCount: parseInt(retryCount, 10),
        timeout: parseInt(timeoutSec, 10) * 1000,
        status: "active",
        createdBy: "admin-1",
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/integration/webhooks"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create webhook")
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
        <p className="text-lg font-medium text-white">Webhook created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Webhooks
      </button>
      <PageHeader title="New Webhook" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Webhook name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">URL</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/webhook" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Events (comma-separated)</label>
          <input type="text" value={events} onChange={(e) => setEvents(e.target.value)} placeholder="member.created, payment.received" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Retry Count</label>
            <input type="number" value={retryCount} onChange={(e) => setRetryCount(e.target.value)} min="0" max="10" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Timeout (seconds)</label>
              <input type="number" value={timeoutSec} onChange={(e) => setTimeoutSec(e.target.value)} min="1" max="60" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || !name || !url || !events}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Webhook"}
        </button>
      </div>
    </div>
  )
}
