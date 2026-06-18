"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Eye, Trash2, Archive, CheckCircle, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  MARKETPLACE_LISTING_TYPE_LABELS,
  MARKETPLACE_LISTING_STATUS_LABELS,
} from "@/lib/constants"
import { getMarketplaceListingService } from "@/lib/services"
import type { MarketplaceListing, MarketplaceListingType, MarketplaceListingStatus } from "@/types"

function ListingStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    pending_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    expired: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    archived: "bg-gray-700/30 text-gray-500 border-gray-600/40",
    approved: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = MARKETPLACE_LISTING_STATUS_LABELS[status as MarketplaceListingStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [listing, setListing] = useState<MarketplaceListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchListing = async () => {
    try {
      const svc = await getMarketplaceListingService()
      const data = await svc.getListing(id)
      setListing(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load listing")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMarketplaceListingService()
        const data = await svc.getListing(id)
        if (!cancelled) setListing(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load listing")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleAction = async (action: string, status: MarketplaceListingStatus) => {
    setActionLoading(action)
    try {
      const svc = await getMarketplaceListingService()
      await svc.updateListingStatus(id, status)
      await fetchListing()
    } catch (e) {
      alert(e instanceof Error ? e.message : `Failed to ${action} listing`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getMarketplaceListingService()
      await svc.deleteListing(id)
      router.push("/app/marketplace/listings")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete listing")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading listing...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Listing not found.</div>
      </div>
    )
  }

  const isDraft = listing.status === "draft"
  const isActive = listing.status === "active"
  const isApproved = listing.status === "approved"
  const isPendingReview = listing.status === "pending_review"
  const canActivate = isApproved || isDraft
  const canArchive = isActive || isApproved || isPendingReview

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Listings
      </button>

      <PageHeader
        title={listing.title}
        description={`Status: ${listing.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — ${listing.viewCount} views`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Listing Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Listing Type</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">
                  {MARKETPLACE_LISTING_TYPE_LABELS[listing.listingType as MarketplaceListingType] || listing.listingType}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><ListingStatusBadge status={listing.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Member</p>
                <p className="text-sm font-medium text-white mt-1">{listing.memberId}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-white mt-1">{listing.categoryId || "-"}</p>
              </div>
              {listing.price !== undefined && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-medium text-white mt-1">
                    {listing.currency || ""} {listing.price}
                  </p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-white mt-1">{listing.location || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Views</p>
                <p className="text-sm font-medium text-white mt-1">{listing.viewCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(listing.createdDate || listing.createdAt).toLocaleDateString()}</p>
              </div>
              {listing.expiryDate && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm font-medium text-white mt-1">{new Date(listing.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
              {listing.publishedAt && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Published At</p>
                  <p className="text-sm font-medium text-white mt-1">{new Date(listing.publishedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          {listing.tags.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1 text-xs font-medium text-[#3CA4F9]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {canActivate && (
                <button
                  onClick={() => handleAction("activate", "active")}
                  disabled={actionLoading === "activate"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "activate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {actionLoading === "activate" ? "Activating..." : "Activate"}
                </button>
              )}
              {canArchive && (
                <button
                  onClick={() => handleAction("archive", "archived")}
                  disabled={actionLoading === "archive"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "archive" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  {actionLoading === "archive" ? "Archiving..." : "Archive"}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={actionLoading === "delete"}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {actionLoading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {actionLoading === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
