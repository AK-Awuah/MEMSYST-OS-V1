"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Store, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  BUSINESS_VERIFICATION_STATUSES,
  BUSINESS_VERIFICATION_STATUS_LABELS,
} from "@/lib/constants"
import { getBusinessProfileService } from "@/lib/services"
import type { BusinessProfile, BusinessVerificationStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function VerificationBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    verified: "bg-green-500/15 text-green-400 border-green-500/30",
    unverified: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-500/15 text-red-400 border-red-500/30",
    revoked: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = BUSINESS_VERIFICATION_STATUS_LABELS[status as BusinessVerificationStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    inactive: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    suspended: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${c}`}>
      {status}
    </span>
  )
}

export default function BusinessesPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [verificationFilter, setVerificationFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getBusinessProfileService()
        const data = await svc.listBusinesses("tenant-1")
        if (!cancelled) setBusinesses(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load businesses")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: businesses.length,
    verified: businesses.filter((b) => b.verificationStatus === "verified").length,
    pending: businesses.filter((b) => b.verificationStatus === "pending").length,
    active: businesses.filter((b) => b.status === "active").length,
  }), [businesses])

  const filtered = useMemo(() => {
    let result = businesses
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((b) => b.businessName.toLowerCase().includes(s))
    }
    if (verificationFilter !== "all") {
      result = result.filter((b) => b.verificationStatus === verificationFilter)
    }
    return result
  }, [search, verificationFilter, businesses])

  const columns: Column<BusinessProfile>[] = [
    {
      key: "businessName",
      header: "Business Name",
      render: (b) => <span className="font-medium text-white">{b.businessName}</span>,
    },
    {
      key: "categoryId",
      header: "Category",
      render: (b) => <span className="text-gray-400">{b.categoryId || "-"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: "verificationStatus",
      header: "Verification",
      render: (b) => <VerificationBadge status={b.verificationStatus} />,
    },
    {
      key: "memberId",
      header: "Member",
      render: (b) => <span className="text-gray-400">{b.memberId}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business Directory" description="Manage business profiles" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<Store className="h-5 w-5" />} />
          <StatCard title="Verified" value="-" icon={<Store className="h-5 w-5" />} />
          <StatCard title="Pending" value="-" icon={<Store className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Store className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading businesses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business Directory" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Business Directory"
          description="Manage business profiles"
          actions={
            <Link
              href="/app/marketplace/businesses/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Business Profile
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<Store className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Store className="h-5 w-5" />} />
        <StatCard title="Verified" value={stats.verified} icon={<Store className="h-5 w-5" />} />
        <StatCard title="Pending Verification" value={stats.pending} icon={<Store className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search businesses by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Verification Statuses</option>
          {BUSINESS_VERIFICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{BUSINESS_VERIFICATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(b) => router.push(`/app/marketplace/businesses/${b.id}`)}
          emptyMessage="No businesses found."
        />
      </motion.div>
    </motion.div>
  )
}
