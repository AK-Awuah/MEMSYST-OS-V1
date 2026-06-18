"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, ShoppingBag, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  MARKETPLACE_LISTING_TYPES,
  MARKETPLACE_LISTING_TYPE_LABELS,
  MARKETPLACE_LISTING_STATUSES,
  MARKETPLACE_LISTING_STATUS_LABELS,
} from "@/lib/constants"
import { getMarketplaceListingService } from "@/lib/services"
import type { MarketplaceListing, MarketplaceListingStatus, MarketplaceListingType } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

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

export default function MarketListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMarketplaceListingService()
        const data = await svc.listListings("tenant-1")
        if (!cancelled) setListings(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load listings")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    pending: listings.filter((l) => l.status === "pending_review").length,
    draft: listings.filter((l) => l.status === "draft").length,
  }), [listings])

  const filtered = useMemo(() => {
    let result = listings
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((l) => l.title.toLowerCase().includes(s))
    }
    if (typeFilter !== "all") {
      result = result.filter((l) => l.listingType === typeFilter)
    }
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter)
    }
    return result
  }, [search, typeFilter, statusFilter, listings])

  const columns: Column<MarketplaceListing>[] = [
    {
      key: "title",
      header: "Title",
      render: (l) => <span className="font-medium text-white">{l.title}</span>,
    },
    {
      key: "listingType",
      header: "Type",
      render: (l) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {MARKETPLACE_LISTING_TYPE_LABELS[l.listingType as MarketplaceListingType] || l.listingType}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (l) => <ListingStatusBadge status={l.status} />,
    },
    {
      key: "memberId",
      header: "Member",
      render: (l) => <span className="text-gray-400">{l.memberId}</span>,
    },
    {
      key: "createdDate",
      header: "Created Date",
      render: (l) => <span className="text-gray-400">{new Date(l.createdDate || l.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "viewCount",
      header: "Views",
      render: (l) => <span className="text-gray-400">{l.viewCount}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Listings" description="Manage all marketplace listings" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<ShoppingBag className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<ShoppingBag className="h-5 w-5" />} />
          <StatCard title="Pending" value="-" icon={<ShoppingBag className="h-5 w-5" />} />
          <StatCard title="Draft" value="-" icon={<ShoppingBag className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Listings" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Marketplace Listings"
          description="Manage all marketplace listings"
          actions={
            <Link
              href="/app/marketplace/listings/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Listing
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Pending Review" value={stats.pending} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Draft" value={stats.draft} icon={<ShoppingBag className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search listings by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Types</option>
          {MARKETPLACE_LISTING_TYPES.map((t) => (
            <option key={t} value={t}>{MARKETPLACE_LISTING_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {MARKETPLACE_LISTING_STATUSES.map((s) => (
            <option key={s} value={s}>{MARKETPLACE_LISTING_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(l) => router.push(`/app/marketplace/listings/${l.id}`)}
          emptyMessage="No listings found."
        />
      </motion.div>
    </motion.div>
  )
}
