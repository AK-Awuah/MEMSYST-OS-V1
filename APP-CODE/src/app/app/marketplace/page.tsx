"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight, ShoppingBag, Tag, Store, Briefcase, CheckSquare, Eye,
  BarChart3, ShieldCheck, Settings, Search, FileText, ClipboardList
} from "lucide-react"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { getMarketplaceAnalyticsService } from "@/lib/services"
import type { MarketplaceAnalytics } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface NavCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const navCards: NavCard[] = [
  { title: "Listings", description: "Manage marketplace listings", href: "/app/marketplace/listings", icon: <ShoppingBag className="h-5 w-5" /> },
  { title: "Businesses", description: "Business directory profiles", href: "/app/marketplace/businesses", icon: <Store className="h-5 w-5" /> },
  { title: "Categories", description: "Business categories", href: "/app/marketplace/categories", icon: <Tag className="h-5 w-5" /> },
  { title: "Opportunities", description: "Employment and partnerships", href: "/app/marketplace/opportunities", icon: <Briefcase className="h-5 w-5" /> },
  { title: "Approvals", description: "Pending listing approvals", href: "/app/marketplace/approvals", icon: <CheckSquare className="h-5 w-5" /> },
  { title: "Search", description: "Search marketplace directory", href: "/app/marketplace/search", icon: <Search className="h-5 w-5" /> },
  { title: "Analytics", description: "Marketplace performance metrics", href: "/app/marketplace/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Compliance", description: "Moderation and compliance", href: "/app/marketplace/compliance", icon: <ShieldCheck className="h-5 w-5" /> },
  { title: "Audit", description: "Marketplace activity logs", href: "/app/marketplace/audit", icon: <ClipboardList className="h-5 w-5" /> },
  { title: "Settings", description: "Marketplace configuration", href: "/app/marketplace/settings", icon: <Settings className="h-5 w-5" /> },
]

export default function MarketplacePage() {
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
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load analytics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading marketplace overview...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Marketplace Platform"
          description="Manage listings, business directory, opportunities, and commerce."
          actions={
            <Link
              href="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Dashboard
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Listings" value={analytics?.totalListings ?? 0} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Active Listings" value={analytics?.activeListings ?? 0} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Businesses" value={analytics?.totalBusinessProfiles ?? 0} icon={<Store className="h-5 w-5" />} />
        <StatCard title="Opportunities" value={analytics?.totalOpportunities ?? 0} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Pending Approvals" value={analytics?.pendingApprovals ?? 0} icon={<CheckSquare className="h-5 w-5" />} />
        <StatCard title="Total Views" value={analytics?.totalListingViews ?? 0} icon={<Eye className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {navCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <motion.div
              whileHover={{ y: -3, borderColor: "rgba(60,164,249,0.4)" }}
              className="group relative overflow-hidden rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 p-5 backdrop-blur-md transition-all hover:shadow-[0_0_20px_rgba(60,164,249,0.12)]"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#3CA4F9]/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#012a42] text-[#3CA4F9] shadow-inner border border-white/5 transition-colors group-hover:bg-[#3CA4F9]/10">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                    <p className="mt-0.5 text-xs text-gray-400">{card.description}</p>
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-[#3CA4F9]" />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
