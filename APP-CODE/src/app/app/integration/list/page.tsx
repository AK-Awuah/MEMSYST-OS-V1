"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { INTEGRATION_TYPE_LABELS } from "@/lib/constants"
import { getIntegrationService } from "@/lib/services"
import type { ThirdPartyIntegration } from "@/types"

export default function IntegrationsListPage() {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [syncingId, setSyncingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getIntegrationService()
        const data = await svc.listIntegrations("tenant-1")
        if (!cancelled) setIntegrations(data)
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
      await svc.toggleIntegration(id)
      setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, isEnabled: !i.isEnabled } : i))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to toggle")
    }
  }

  const handleSync = async (id: string) => {
    setSyncingId(id)
    try {
      const svc = await getIntegrationService()
      await svc.syncIntegration(id)
      setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, syncStatus: "syncing" as const } : i))
      setTimeout(async () => {
        const svc2 = await getIntegrationService()
        const updated = await svc2.getIntegration(id)
        if (updated) setIntegrations((prev) => prev.map((i) => i.id === id ? updated : i))
        setSyncingId(null)
      }, 2000)
    } catch {
      setSyncingId(null)
    }
  }

  const filtered = integrations.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<ThirdPartyIntegration>[] = [
    { key: "name", header: "Name", render: (i) => <span className="text-white">{i.name}</span> },
    { key: "integrationType", header: "Type", render: (i) => <span className="text-gray-400">{INTEGRATION_TYPE_LABELS[i.integrationType]}</span> },
    { key: "provider", header: "Provider", render: (i) => <span className="text-gray-400">{i.provider}</span> },
    { key: "lastSyncAt", header: "Last Sync", render: (i) => <span className="text-gray-400">{i.lastSyncAt ? new Date(i.lastSyncAt).toLocaleDateString() : "Never"}</span> },
    { key: "syncStatus", header: "Sync", render: (i) => <StatusBadge status={i.syncStatus} /> },
    { key: "isEnabled", header: "Enabled", render: (i) => (
      <button onClick={() => handleToggle(i.id)} className="text-gray-400 hover:text-white transition-colors">
        {i.isEnabled ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5" />}
      </button>
    )},
    {
      key: "actions", header: "", render: (i) => (
        <button onClick={() => handleSync(i.id)} disabled={syncingId === i.id}
          className="p-1.5 rounded-md bg-[#3CA4F9]/20 text-[#3CA4F9] hover:bg-[#3CA4F9]/30 transition-colors disabled:opacity-50" title="Sync">
          <RefreshCw className={`h-3.5 w-3.5 ${syncingId === i.id ? "animate-spin" : ""}`} />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Third-Party Integrations" description="Connected services and providers" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search integrations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No integrations found." />
        </div>
      )}
    </div>
  )
}
