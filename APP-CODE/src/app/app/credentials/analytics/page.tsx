"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, ArrowLeft, CreditCard, Award, Activity, Printer, RotateCcw, FileText } from "lucide-react"
import Link from "next/link"
import { PageHeader, StatCard } from "@/components/admin"
import { getCredentialAnalyticsService } from "@/lib/services"
import type { CredentialAnalytics } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<CredentialAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCredentialAnalyticsService()
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
        <PageHeader title="Credential Analytics" description="Usage and issuance metrics" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5">
              <div className="h-4 w-20 rounded bg-[#1e3a5f] animate-pulse mb-2" />
              <div className="h-8 w-16 rounded bg-[#1e3a5f] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
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
        <PageHeader title="Credential Analytics" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!analytics) return null

  const maxTypeCount = Math.max(...analytics.byType.map((t) => t.count), 1)
  const maxStatusCount = Math.max(...analytics.byStatus.map((s) => s.count), 1)

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Credential Analytics"
          description="Usage and issuance metrics across all credential types"
          actions={
            <Link
              href="/app/credentials"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Credentials" value={analytics.totalCredentials.toLocaleString()} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="ID Cards" value={analytics.totalIDCards.toLocaleString()} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Certificates" value={analytics.totalCertificates.toLocaleString()} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Active" value={analytics.activeCredentials.toLocaleString()} icon={<Activity className="h-5 w-5 text-green-400" />} />
        <StatCard title="Pending Prints" value={analytics.pendingPrintRequests} icon={<Printer className="h-5 w-5 text-yellow-400" />} />
        <StatCard title="Total Reprints" value={analytics.totalReprints} icon={<RotateCcw className="h-5 w-5 text-purple-400" />} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#3CA4F9]" /> By Type
          </h3>
          <div className="space-y-3">
            {analytics.byType.map((item) => (
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
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" /> By Status
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
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" /> Recent Issuances
          </h3>
          <div className="space-y-3">
            {analytics.recentIssuances.map((item) => (
              <div key={item.date} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5">
                <span className="text-sm text-gray-300">{new Date(item.date).toLocaleDateString()}</span>
                <span className="text-sm font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
