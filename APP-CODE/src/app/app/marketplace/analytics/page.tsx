"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3, ArrowLeft, Store, ShoppingBag, Building2, ShieldCheck,
  TrendingUp, Eye, Users, Clock,
} from "lucide-react"
import Link from "next/link"
import { PageHeader, StatCard } from "@/components/admin"
import { getMarketplaceAnalyticsService } from "@/lib/services"
import type { MarketplaceAnalytics } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function MarketplaceAnalyticsPage() {
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMarketplaceAnalyticsService()
        const data = await svc.getAnalytics("tenant-1")
        if (!cancelled) setAnalytics(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load marketplace analytics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Analytics" description="Listings, businesses, and engagement metrics" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
              <div className="h-4 w-20 rounded bg-[#1e3a5f] animate-pulse mb-2" />
              <div className="h-8 w-16 rounded bg-[#1e3a5f] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-6">
              <div className="h-5 w-32 rounded bg-[#1e3a5f] animate-pulse mb-4" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-4 w-full rounded bg-[#1e3a5f] animate-pulse mb-3" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Analytics" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!analytics) return null

  const maxTypeCount = Math.max(...analytics.byListingType.map((t) => t.count), 1)
  const maxStatusCount = Math.max(...analytics.byStatus.map((s) => s.count), 1)

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Marketplace Analytics"
          description="Listings, businesses, and engagement metrics across the marketplace"
          actions={
            <Link
              href="/app/marketplace"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Listings" value={analytics.totalListings.toLocaleString()} icon={<Store className="h-5 w-5" />} />
        <StatCard title="Active Listings" value={analytics.activeListings.toLocaleString()} icon={<ShoppingBag className="h-5 w-5 text-emerald-400" />} />
        <StatCard title="Businesses" value={analytics.totalBusinessProfiles.toLocaleString()} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Verified Businesses" value={analytics.verifiedBusinesses.toLocaleString()} icon={<ShieldCheck className="h-5 w-5 text-cyan-400" />} />
        <StatCard title="Opportunities" value={analytics.totalOpportunities.toLocaleString()} icon={<TrendingUp className="h-5 w-5 text-amber-400" />} />
        <StatCard title="Total Views" value={analytics.totalListingViews.toLocaleString()} icon={<Eye className="h-5 w-5 text-purple-400" />} />
        <StatCard title="Member Participation" value={analytics.memberParticipation} icon={<Users className="h-5 w-5 text-pink-400" />} />
        <StatCard title="Pending Approvals" value={analytics.pendingApprovals} icon={<Clock className="h-5 w-5 text-yellow-400" />} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#3CA4F9]" /> By Listing Type
          </h3>
          <div className="space-y-3">
            {analytics.byListingType.map((item) => (
              <div key={item.type}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{item.type.replace(/_/g, " ")}</span>
                  <span className="text-sm font-medium text-white">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#1e3a5f] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#3CA4F9] transition-all duration-500"
                    style={{ width: `${(item.count / maxTypeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {analytics.byListingType.length === 0 && (
              <p className="text-sm text-gray-500">No listing data available</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" /> By Status
          </h3>
          <div className="space-y-3">
            {analytics.byStatus.map((item) => (
              <div key={item.status}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{item.status.replace(/_/g, " ")}</span>
                  <span className="text-sm font-medium text-white">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#1e3a5f] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {analytics.byStatus.length === 0 && (
              <p className="text-sm text-gray-500">No status data available</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-300">
                    <span className="font-semibold text-white">{item.listings}</span> listings
                  </span>
                  <span className="text-gray-300">
                    <span className="font-semibold text-white">{item.businesses}</span> businesses
                  </span>
                </div>
              </div>
            ))}
            {analytics.recentActivity.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
