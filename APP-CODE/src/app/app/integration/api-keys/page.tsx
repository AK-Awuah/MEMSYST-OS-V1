"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Ban } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { API_KEY_STATUS_LABELS } from "@/lib/constants"
import { getIntegrationService } from "@/lib/services"
import type { APIKey } from "@/types"

export default function APIKeysListPage() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [revokingId, setRevokingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getIntegrationService()
        const data = await svc.listAPIKeys("tenant-1")
        if (!cancelled) setKeys(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this API key?")) return
    setRevokingId(id)
    try {
      const svc = await getIntegrationService()
      await svc.revokeAPIKey(id)
      setKeys((prev) => prev.map((k) => k.id === id ? { ...k, status: "revoked" as const } : k))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to revoke")
    } finally {
      setRevokingId(null)
    }
  }

  const filtered = keys.filter((k) =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<APIKey>[] = [
    { key: "name", header: "Name", render: (k) => <span className="text-white">{k.name}</span> },
    { key: "keyPrefix", header: "Key", render: (k) => <span className="text-gray-400 font-mono text-xs">{k.keyPrefix}...</span> },
    { key: "permissions", header: "Permissions", render: (k) => <span className="text-gray-400 text-xs">{k.permissions.join(", ")}</span> },
    { key: "rateLimit", header: "Rate Limit", render: (k) => <span className="text-gray-400">{k.rateLimit}/hr</span> },
    { key: "lastUsedAt", header: "Last Used", render: (k) => <span className="text-gray-400">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}</span> },
    { key: "status", header: "Status", render: (k) => <StatusBadge status={k.status} /> },
    {
      key: "actions", header: "", render: (k) => k.status === "active" ? (
        <button onClick={() => handleRevoke(k.id)} disabled={revokingId === k.id}
          className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors disabled:opacity-50" title="Revoke">
          {revokingId === k.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
        </button>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="API Keys" description="Manage API access keys" />
        <Link href="/app/integration/api-keys/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New API Key
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search API keys..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No API keys found." />
        </div>
      )}
    </div>
  )
}
