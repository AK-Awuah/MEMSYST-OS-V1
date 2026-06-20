"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight, Vote, Users, BarChart4, FileText, UsersRound,
  CalendarDays, BookCheck, Settings, ClipboardList,
} from "lucide-react"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { GovernanceDashboardMetrics } from "@/types"

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
  { title: "Elections", description: "Manage elections and voting", href: "/app/governance-enhanced/elections", icon: <Vote className="h-5 w-5" /> },
  { title: "Candidates", description: "Candidate nominations", href: "/app/governance-enhanced/candidates", icon: <Users className="h-5 w-5" /> },
  { title: "Committees", description: "Committee management", href: "/app/governance-enhanced/committees", icon: <UsersRound className="h-5 w-5" /> },
  { title: "Meetings", description: "Meeting scheduling and minutes", href: "/app/governance-enhanced/meetings", icon: <CalendarDays className="h-5 w-5" /> },
  { title: "Resolutions", description: "Propose and pass resolutions", href: "/app/governance-enhanced/resolutions", icon: <BookCheck className="h-5 w-5" /> },
  { title: "Analytics", description: "Governance performance metrics", href: "/app/governance-enhanced/analytics", icon: <BarChart4 className="h-5 w-5" /> },
  { title: "Audit", description: "Governance activity logs", href: "/app/governance-enhanced/audit", icon: <ClipboardList className="h-5 w-5" /> },
  { title: "Settings", description: "Governance configuration", href: "/app/governance-enhanced/settings", icon: <Settings className="h-5 w-5" /> },
]

export default function GovernanceEnhancedPage() {
  const [metrics, setMetrics] = useState<GovernanceDashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const data = await svc.getDashboardMetrics("tenant-1")
        if (!cancelled) setMetrics(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard metrics")
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
        <p className="text-sm text-gray-500">Loading governance overview...</p>
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
          title="Governance Platform"
          description="Manage elections, committees, meetings, and resolutions."
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
        <StatCard title="Elections" value={metrics?.totalElections ?? 0} icon={<Vote className="h-5 w-5" />} />
        <StatCard title="Active Elections" value={metrics?.activeElections ?? 0} icon={<Vote className="h-5 w-5" />} />
        <StatCard title="Candidates" value={metrics?.totalCandidates ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Votes Cast" value={metrics?.totalVotesCast ?? 0} icon={<BarChart4 className="h-5 w-5" />} />
        <StatCard title="Committees" value={metrics?.totalCommittees ?? 0} icon={<UsersRound className="h-5 w-5" />} />
        <StatCard title="Resolutions Passed" value={metrics?.passedResolutions ?? 0} icon={<BookCheck className="h-5 w-5" />} />
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
