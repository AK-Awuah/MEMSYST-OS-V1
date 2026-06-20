"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, PauseCircle, Play } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { AD_STATUS_LABELS } from "@/lib/constants"
import { getAdvertisingService } from "@/lib/services"
import type { Advertisement } from "@/types"

export default function AdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [placement, setPlacement] = useState<Advertisement["placement"]>("homepage_banner")
  const [linkUrl, setLinkUrl] = useState("")
  const [rate, setRate] = useState("0")
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAdvertisingService()
        const data = await svc.listAds("tenant-1")
        if (!cancelled) setAds(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handlePause = async (id: string, isActive: boolean) => {
    setActionId(id)
    try {
      const svc = await getAdvertisingService()
      if (isActive) await svc.pauseAd(id)
      else { const ad = ads.find(a => a.id === id); if (ad) await svc.submitAd(id) }
      setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: isActive ? "paused" : "pending_review" } : a))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed")
    } finally {
      setActionId(null)
    }
  }

  const handleAdd = async () => {
    if (!title) return
    setSaving(true)
    try {
      const svc = await getAdvertisingService()
      await svc.createAd("tenant-1", {
        tenantId: "tenant-1", advertiserId: "advertiser-1", advertiserName: "Default",
        title, description, linkUrl, placement, pricingModel: "fixed",
        rate: parseFloat(rate), totalBudget: parseFloat(rate) * 100, currency: "USD",
        targetAudience: "all_members", startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(), status: "draft",
      })
      const data = await svc.listAds("tenant-1")
      setAds(data)
      setShowForm(false); setTitle(""); setDescription(""); setLinkUrl("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed")
    } finally {
      setSaving(false)
    }
  }

  const filtered = ads.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<Advertisement>[] = [
    { key: "title", header: "Title", render: (a) => <span className="text-white">{a.title}</span> },
    { key: "placement", header: "Placement", render: (a) => <span className="text-gray-400 capitalize">{a.placement.replace(/_/g, " ")}</span> },
    { key: "impressions", header: "Impressions", render: (a) => <span className="text-gray-400">{a.impressions.toLocaleString()}</span> },
    { key: "clicks", header: "Clicks", render: (a) => <span className="text-gray-400">{a.clicks.toLocaleString()}</span> },
    { key: "spentBudget", header: "Spent", render: (a) => <span className="text-gray-400">${a.spentBudget.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "actions", header: "", render: (a) =>
        a.status === "active" ? (
          <button onClick={() => handlePause(a.id, true)} disabled={actionId === a.id}
            className="p-1.5 rounded-md bg-yellow-600/40 text-yellow-400 hover:bg-yellow-500/60 transition-colors disabled:opacity-50" title="Pause">
            {actionId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PauseCircle className="h-3.5 w-3.5" />}
          </button>
        ) : a.status === "paused" ? (
          <button onClick={() => handlePause(a.id, false)} disabled={actionId === a.id}
            className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors disabled:opacity-50" title="Activate">
            {actionId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Advertisements" description="Manage ads and placements" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Ad
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search ads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No ads found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Advertisement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Placement</label>
                  <select value={placement} onChange={(e) => setPlacement(e.target.value as Advertisement["placement"])}
                    className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                    <option value="homepage_banner">Homepage Banner</option>
                    <option value="marketplace_sidebar">Marketplace Sidebar</option>
                    <option value="training_hub">Training Hub</option>
                    <option value="directory_featured">Directory Featured</option>
                    <option value="event_sponsor">Event Sponsor</option>
                    <option value="popup">Popup</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Rate ($)</label>
                  <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} min="0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Link URL</label>
                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !title}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
