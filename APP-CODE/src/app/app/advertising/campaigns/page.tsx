"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Rocket, CheckCircle } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAdvertisingService } from "@/lib/services"
import type { AdCampaign } from "@/types"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [advertiserName, setAdvertiserName] = useState("")
  const [totalBudget, setTotalBudget] = useState("0")
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAdvertisingService()
        const data = await svc.listCampaigns("tenant-1")
        if (!cancelled) setCampaigns(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleLaunch = async (id: string) => {
    setActionId(id)
    try {
      const svc = await getAdvertisingService()
      await svc.launchCampaign(id)
      setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "active" as const } : c))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to launch")
    } finally {
      setActionId(null)
    }
  }

  const handleComplete = async (id: string) => {
    setActionId(id)
    try {
      const svc = await getAdvertisingService()
      await svc.completeCampaign(id)
      setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "completed" as const } : c))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to complete")
    } finally {
      setActionId(null)
    }
  }

  const handleAdd = async () => {
    if (!name) return
    setSaving(true)
    try {
      const svc = await getAdvertisingService()
      await svc.createCampaign("tenant-1", {
        tenantId: "tenant-1", name, description, advertiserId: "advertiser-1", advertiserName: advertiserName || name,
        ads: [], totalBudget: parseFloat(totalBudget), startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(), status: "draft",
      })
      const data = await svc.listCampaigns("tenant-1")
      setCampaigns(data)
      setShowForm(false); setName(""); setDescription("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed")
    } finally {
      setSaving(false)
    }
  }

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<AdCampaign>[] = [
    { key: "name", header: "Name", render: (c) => <span className="text-white">{c.name}</span> },
    { key: "advertiserName", header: "Advertiser", render: (c) => <span className="text-gray-400">{c.advertiserName}</span> },
    { key: "totalBudget", header: "Budget", render: (c) => <span className="text-gray-400">${c.totalBudget.toLocaleString()}</span> },
    { key: "spentBudget", header: "Spent", render: (c) => <span className="text-gray-400">${c.spentBudget.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    {
      key: "actions", header: "", render: (c) => (
        <div className="flex gap-1.5">
          {c.status === "draft" && (
            <button onClick={() => handleLaunch(c.id)} disabled={actionId === c.id}
              className="p-1.5 rounded-md bg-blue-600/40 text-blue-400 hover:bg-blue-500/60 transition-colors disabled:opacity-50" title="Launch">
              {actionId === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}
            </button>
          )}
          {c.status === "active" && (
            <button onClick={() => handleComplete(c.id)} disabled={actionId === c.id}
              className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors disabled:opacity-50" title="Complete">
              {actionId === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Campaigns" description="Ad campaign management" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No campaigns found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Advertiser Name</label>
                  <input type="text" value={advertiserName} onChange={(e) => setAdvertiserName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Total Budget ($)</label>
                  <input type="number" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} min="0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !name}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
