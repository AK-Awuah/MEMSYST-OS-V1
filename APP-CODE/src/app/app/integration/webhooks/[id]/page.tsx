"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getIntegrationService } from "@/lib/services"
import type { Webhook, WebhookDelivery } from "@/types"

export default function WebhookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [webhook, setWebhook] = useState<Webhook | null>(null)
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getIntegrationService()
        const [webhookData, deliveriesData] = await Promise.all([
          svc.getWebhook(id),
          svc.listDeliveries(id),
        ])
        if (!cancelled) { setWebhook(webhookData); setDeliveries(deliveriesData) }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load webhook")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const deliveryColumns: Column<WebhookDelivery>[] = [
    { key: "createdAt", header: "Date", render: (d) => <span className="text-gray-400 text-xs">{new Date(d.createdAt).toLocaleString()}</span> },
    { key: "event", header: "Event", render: (d) => <span className="text-white text-xs">{d.event}</span> },
    { key: "responseStatus", header: "Status Code", render: (d) => <span className="text-gray-400">{d.responseStatus ?? "-"}</span> },
    { key: "duration", header: "Duration", render: (d) => <span className="text-gray-400">{d.duration}ms</span> },
    { key: "attemptNumber", header: "Attempt", render: (d) => <span className="text-gray-400">{d.attemptNumber}</span> },
    { key: "status", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (error || !webhook) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Webhook not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Webhooks
      </button>
      <PageHeader title={webhook.name} description={webhook.url} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Webhook Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">URL</p>
                <p className="text-sm text-white mt-1 truncate">{webhook.url}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={webhook.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Retry Count</p>
                <p className="text-sm text-white mt-1">{webhook.retryCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Timeout</p>
                <p className="text-sm text-white mt-1">{webhook.timeout / 1000}s</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Last Triggered</p>
                <p className="text-sm text-white mt-1">{webhook.lastTriggeredAt ? new Date(webhook.lastTriggeredAt).toLocaleString() : "Never"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Last Success</p>
                <p className="text-sm text-white mt-1">{webhook.lastSuccessAt ? new Date(webhook.lastSuccessAt).toLocaleString() : "-"}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Events</h4>
              <div className="flex flex-wrap gap-1.5">
                {webhook.events.map((ev, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-[#3CA4F9]/10 border border-[#3CA4F9]/30 text-xs text-[#3CA4F9]">{ev}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Delivery History ({deliveries.length})</h3>
            <DataTable columns={deliveryColumns} data={deliveries} emptyMessage="No deliveries yet." />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Headers</h3>
            {Object.keys(webhook.headers).length > 0 ? (
              <div className="space-y-1.5">
                {Object.entries(webhook.headers).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-gray-400">{k}: </span>
                    <span className="text-gray-300">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No custom headers.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
