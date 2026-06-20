"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, DollarSign, GraduationCap, Handshake, BookOpen,
  Users, FileText, BarChart3, Activity,
} from "lucide-react"
import { PageHeader, StatCard } from "@/components/admin"
import { getSupportHubService } from "@/lib/services"
import type { SupportHubAnalytics } from "@/types"

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

export default function SupportHubAnalyticsPage() {
  const [analytics, setAnalytics] = useState<SupportHubAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
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
        <PageHeader title="Support Hub Analytics" description="Loading analytics..." />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Support Hub Analytics" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
        <Link href="/app/support-hub" className="inline-flex items-center gap-2 text-sm text-[#3CA4F9] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Support Hub
        </Link>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Support Hub Analytics"
          description="Key support hub performance metrics and insights."
          actions={
            <Link
              href="/app/support-hub"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Support Hub
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Loans" value={analytics?.totalLoans ?? 0} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Active Loans" value={analytics?.activeLoans ?? 0} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Loan Amount" value={`$${(analytics?.totalLoanAmount ?? 0).toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Outstanding Balance" value={`$${(analytics?.outstandingBalance ?? 0).toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Total Scholarships" value={analytics?.totalScholarships ?? 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Active Scholarships" value={analytics?.activeScholarships ?? 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Sponsorships" value={analytics?.totalSponsorships ?? 0} icon={<Handshake className="h-5 w-5" />} />
        <StatCard title="Programs" value={analytics?.totalPrograms ?? 0} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Beneficiaries" value={analytics?.totalBeneficiaries ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Resources" value={analytics?.totalResources ?? 0} icon={<FileText className="h-5 w-5" />} />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">By Category</h3>
          {analytics?.byCategory && analytics.byCategory.length > 0 ? (
            <div className="space-y-3">
              {analytics.byCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{item.category.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-[#1e3a5f] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#3CA4F9]"
                        style={{ width: `${Math.min(100, (item.count / Math.max(...analytics.byCategory.map((c) => c.count))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No category data available.</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-[#1e3a5f]/50 pb-3 last:border-0">
                  <Activity className="h-4 w-4 text-[#3CA4F9] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{a.item}</p>
                    <p className="text-xs text-gray-500">{a.action} &middot; {a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent activity data available.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
