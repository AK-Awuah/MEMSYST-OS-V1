"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, Star, TrendingUp } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { PREMIUM_TIER_LABELS } from "@/lib/constants"
import { getTieringService } from "@/lib/services"
import type { PremiumListing } from "@/types"

export default function ListingsPage() {
  const [listings, setListings] = useState<PremiumListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTieringService()
        const data = await svc.listListings("tenant-1")
        if (!cancelled) setListings(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleFeature = async (id: string, isFeatured: boolean) => {
    setActionId(id)
    try {
      const svc = await getTieringService()
      if (!isFeatured) await svc.featureListing(id, new Date(Date.now() + 30 * 86400000).toISOString())
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, isFeatured: !isFeatured, featuredUntil: !isFeatured ? new Date(Date.now() + 30 * 86400000).toISOString() : undefined } : l))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed")
    } finally {
      setActionId(null)
    }
  }

  const filtered = listings.filter((l) =>
    l.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<PremiumListing>[] = [
    { key: "listingTitle", header: "Listing", render: (l) => <span className="text-white">{l.listingTitle}</span> },
    { key: "listingType", header: "Type", render: (l) => <span className="text-gray-400 capitalize">{l.listingType.replace(/_/g, " ")}</span> },
    { key: "tier", header: "Tier", render: (l) => <span className="text-gray-400 capitalize">{PREMIUM_TIER_LABELS[l.tier]}</span> },
    { key: "boostFactor", header: "Boost", render: (l) => <span className="text-gray-400">{l.boostFactor}x</span> },
    { key: "placementPriority", header: "Priority", render: (l) => <span className="text-gray-400">{l.placementPriority}</span> },
    { key: "isFeatured", header: "Featured", render: (l) => <StatusBadge status={l.isFeatured ? "active" : "inactive"} /> },
    {
      key: "actions", header: "", render: (l) => (
        <button onClick={() => handleFeature(l.id, l.isFeatured)} disabled={actionId === l.id && !l.isFeatured}
          className={`p-1.5 rounded-md transition-colors disabled:opacity-50 ${l.isFeatured ? "bg-yellow-600/40 text-yellow-400 hover:bg-yellow-500/60" : "bg-blue-600/40 text-blue-400 hover:bg-blue-500/60"}`} title={l.isFeatured ? "Unfeature" : "Feature"}>
          {actionId === l.id && !l.isFeatured ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5" />}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Premium Listings" description="Featured and boosted listings" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No premium listings found." />
        </div>
      )}
    </div>
  )
}
