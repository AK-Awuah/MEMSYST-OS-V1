"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BarChart3, Users, UserCheck, UserX, TrendingUp, ArrowLeft } from "lucide-react"
import { PageHeader, StatCard } from "@/components/admin"
import { getMemberAnalyticsService } from "@/lib/services"
import type { MemberAnalytics } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function MemberAnalyticsPage() {
  const [analytics, setAnalytics] = useState<MemberAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMemberAnalyticsService()
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
      <div className="space-y-6">
        <PageHeader title="Member Analytics" description="Membership metrics and trends" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-[#1e3a5f]" />
              <div className="h-8 w-16 animate-pulse rounded bg-[#1e3a5f]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Member Analytics" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Member Analytics"
          description="Membership metrics and trends"
          actions={
            <Link
              href="/app/members"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={analytics?.totalMembers ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active Members" value={analytics?.activeMembers ?? 0} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Inactive Members" value={analytics?.inactiveMembers ?? 0} icon={<UserX className="h-5 w-5" />} />
        <StatCard title="Total Apprentices" value={analytics?.totalApprentices ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pending Approvals" value={analytics?.pendingApprovals ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Pending Renewals" value={analytics?.pendingRenewals ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Recent Renewals" value={analytics?.recentRenewals ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
      </motion.div>

      {analytics?.growthTrends && analytics.growthTrends.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-sm font-semibold text-white">Growth Trends</h3>
          <div className="space-y-2">
            {analytics.growthTrends.map((trend) => (
              <div key={trend.month} className="flex items-center justify-between rounded-lg border border-[#1e3a5f]/30 bg-[#012a42]/50 px-4 py-2.5">
                <span className="text-sm text-gray-300">{trend.month}</span>
                <div className="flex gap-6">
                  <span className="text-sm text-white">{trend.members} members</span>
                  <span className="text-sm text-gray-400">{trend.apprentices} apprentices</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
