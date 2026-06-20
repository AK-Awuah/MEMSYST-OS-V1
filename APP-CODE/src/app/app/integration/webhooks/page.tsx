"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Pause, Play } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { WEBHOOK_STATUS_LABELS } from "@/lib/constants"
import { getIntegrationService } from "@/lib/services"
import type { Webhook } from "@/types"

export default function WebhooksListPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getIntegrationService()
        const data = await svc.listWebhooks("tenant-1")
        if (!cancelled) setWebhooks(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleToggle = async (id: string) => {
    try {
      const svc = await getIntegrationService()
      await svc.toggleWebhook(id)
      setWebhooks((prev) => prev.map((w) => {
        if (w.id !== id) return w
        const newStatus = w.status === "active" ? "paused" as const : "active" as const
        return { ...w, status: newStatus }
      }))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to toggle webhook")
    }
  }

  const filtered = webhooks.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Webhook>[] = [
    { key: "name", header: "Name", render: (w) => (
      <Link href={`/app/integration/webhooks/${w.id}`} className="text-[#3CA4F9] hover:underline font-medium">{w.name}</Link>
    )},
    { key: "url", header: "URL", render: (w) => <span className="text-gray-400 text-xs truncate max-w-[200px] inline-block">{w.url}</span> },
    { key: "events", header: "Events", render: (w) => <span className="text-gray-400 text-xs">{w.events.length} events</span> },
    { key: "lastTriggeredAt", header: "Last Triggered", render: (w) => <span className="text-gray-400">{w.lastTriggeredAt ? new Date(w.lastTriggeredAt).toLocaleDateString() : "Never"}</span> },
    { key: "status", header: "Status", render: (w) => <StatusBadge status={w.status} /> },
    {
      key: "actions", header: "", render: (w) => (
        <button onClick={() => handleToggle(w.id)}
          className="p-1.5 rounded-md bg-[#3CA4F9]/20 text-[#3CA4F9] hover:bg-[#3CA4F9]/30 transition-colors" title={w.status === "active" ? "Pause" : "Activate"}>
          {w.status === "active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Webhooks" description="Webhook endpoints and deliveries" />
        <Link href="/app/integration/webhooks/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Webhook
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search webhooks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No webhooks found." />
        </div>
      )}
    </div>
  )
}
