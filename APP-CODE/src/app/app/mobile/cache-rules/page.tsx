"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getMobileService } from "@/lib/services"
import type { OfflineCacheRule } from "@/types"

export default function CacheRulesPage() {
  const [rules, setRules] = useState<OfflineCacheRule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [urlPattern, setUrlPattern] = useState("")
  const [cacheStrategy, setCacheStrategy] = useState<OfflineCacheRule["cacheStrategy"]>("network_first")
  const [maxAge, setMaxAge] = useState("3600")
  const [maxEntries, setMaxEntries] = useState("50")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMobileService()
        const data = await svc.listCacheRules("tenant-1")
        if (!cancelled) setRules(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleAdd = async () => {
    if (!urlPattern) return
    setSaving(true)
    try {
      const svc = await getMobileService()
      await svc.createCacheRule("tenant-1", {
        tenantId: "tenant-1",
        urlPattern,
        cacheStrategy,
        maxAge: parseInt(maxAge, 10),
        maxEntries: parseInt(maxEntries, 10),
        prioritizePages: [],
      })
      const data = await svc.listCacheRules("tenant-1")
      setRules(data)
      setShowForm(false)
      setUrlPattern("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create rule")
    } finally {
      setSaving(false)
    }
  }

  const filtered = rules.filter((r) =>
    r.urlPattern.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<OfflineCacheRule>[] = [
    { key: "urlPattern", header: "URL Pattern", render: (r) => <span className="text-white font-mono text-xs">{r.urlPattern}</span> },
    { key: "cacheStrategy", header: "Strategy", render: (r) => <span className="text-gray-400 capitalize">{r.cacheStrategy.replace(/_/g, " ")}</span> },
    { key: "maxAge", header: "Max Age (s)", render: (r) => <span className="text-gray-400">{r.maxAge.toLocaleString()}</span> },
    { key: "maxEntries", header: "Max Entries", render: (r) => <span className="text-gray-400">{r.maxEntries}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Cache Rules" description="Offline caching strategies" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Rule
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search patterns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No cache rules defined." />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Cache Rule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">URL Pattern</label>
                <input type="text" value={urlPattern} onChange={(e) => setUrlPattern(e.target.value)} placeholder="/api/members/*"
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Strategy</label>
                <select value={cacheStrategy} onChange={(e) => setCacheStrategy(e.target.value as OfflineCacheRule["cacheStrategy"])}
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                  <option value="network_first">Network First</option>
                  <option value="cache_first">Cache First</option>
                  <option value="stale_while_revalidate">Stale While Revalidate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Age (seconds)</label>
                  <input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} min="0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Entries</label>
                  <input type="number" value={maxEntries} onChange={(e) => setMaxEntries(e.target.value)} min="1" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !urlPattern}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
