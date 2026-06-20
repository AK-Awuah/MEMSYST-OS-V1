"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight, DollarSign, GraduationCap, Handshake, BookOpen,
  Users, FileText, BarChart3, ClipboardList, Settings,
} from "lucide-react"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
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

interface NavCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const navCards: NavCard[] = [
  { title: "Loans", description: "Manage loans and repayments", href: "/app/support-hub/loans", icon: <DollarSign className="h-5 w-5" /> },
  { title: "Scholarships", description: "Scholarship programs and awards", href: "/app/support-hub/scholarships", icon: <GraduationCap className="h-5 w-5" /> },
  { title: "Sponsorships", description: "Sponsorship opportunities", href: "/app/support-hub/sponsorships", icon: <Handshake className="h-5 w-5" /> },
  { title: "Programs", description: "Support programs and initiatives", href: "/app/support-hub/programs", icon: <BookOpen className="h-5 w-5" /> },
  { title: "Resources", description: "Resource library", href: "/app/support-hub/resources", icon: <FileText className="h-5 w-5" /> },
  { title: "Analytics", description: "Support hub performance metrics", href: "/app/support-hub/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Audit", description: "Support hub activity logs", href: "/app/support-hub/audit", icon: <ClipboardList className="h-5 w-5" /> },
  { title: "Settings", description: "Support hub configuration", href: "/app/support-hub/settings", icon: <Settings className="h-5 w-5" /> },
]

export default function SupportHubPage() {
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
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading support hub overview...</p>
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
          title="Support Hub"
          description="Manage loans, scholarships, sponsorships, programs, and resources."
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
        <StatCard title="Total Loans" value={analytics?.totalLoans ?? 0} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Active Loans" value={analytics?.activeLoans ?? 0} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Scholarships" value={analytics?.totalScholarships ?? 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Sponsorships" value={analytics?.totalSponsorships ?? 0} icon={<Handshake className="h-5 w-5" />} />
        <StatCard title="Beneficiaries" value={analytics?.totalBeneficiaries ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Resources" value={analytics?.totalResources ?? 0} icon={<FileText className="h-5 w-5" />} />
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
