"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  MARKETPLACE_LISTING_TYPES,
  MARKETPLACE_LISTING_TYPE_LABELS,
} from "@/lib/constants"
import { getMarketplaceListingService } from "@/lib/services"
import type { MarketplaceListingType } from "@/types"

export default function NewListingPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [listingType, setListingType] = useState<MarketplaceListingType>("product")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("")
  const [location, setLocation] = useState("")
  const [tags, setTags] = useState("")

  const handleSubmit = async () => {
    if (!title || !description) return
    setSubmitting(true)
    try {
      const svc = await getMarketplaceListingService()
      await svc.createListing({
        tenantId: "tenant-1",
        memberId: "auto",
        listingType,
        title,
        description,
        categoryId: categoryId || undefined,
        price: price ? parseFloat(price) : undefined,
        currency: currency || undefined,
        location: location || undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        images: [],
        videos: [],
        documents: [],
        status: "draft",
        createdDate: new Date().toISOString(),
        expiryDate: undefined,
        publishedAt: undefined,
      })
      router.push("/app/marketplace/listings")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create listing")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Listings
      </button>

      <PageHeader title="New Listing" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Listing Type</label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as MarketplaceListingType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {MARKETPLACE_LISTING_TYPES.map((t) => (
                <option key={t} value={t}>{MARKETPLACE_LISTING_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category ID</label>
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Category identifier"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Listing title"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the listing"
            rows={4}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (optional)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Currency (optional)</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="USD, EUR, GHS..."
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Location (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, region, or address"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title || !description}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Listing"}
        </button>
      </div>
    </div>
  )
}
