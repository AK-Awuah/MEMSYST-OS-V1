"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Search, Handshake } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  SPONSORSHIP_STATUSES,
  SPONSORSHIP_STATUS_LABELS,
  SPONSORSHIP_CATEGORIES,
  SPONSORSHIP_CATEGORY_LABELS,
} from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { Sponsorship, SponsorshipStatus, SponsorshipCategory } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function SponsorshipStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    fulfilled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = SPONSORSHIP_STATUS_LABELS[status as SponsorshipStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function SponsorshipsPage() {
  const router = useRouter()
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.listSponsorships("tenant-1")
        if (!cancelled) setSponsorships(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load sponsorships")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: sponsorships.length,
    active: sponsorships.filter((s) => s.status === "active").length,
    fulfilled: sponsorships.filter((s) => s.status === "fulfilled").length,
    cancelled: sponsorships.filter((s) => s.status === "cancelled").length,
  }), [sponsorships])

  const filtered = useMemo(() => {
    let result = sponsorships
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.sponsorName.toLowerCase().includes(q))
    }
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter)
    }
    if (categoryFilter !== "all") {
      result = result.filter((s) => s.category === categoryFilter)
    }
    return result
  }, [search, statusFilter, categoryFilter, sponsorships])

  const columns: Column<Sponsorship>[] = [
    {
      key: "title",
      header: "Title",
      render: (s) => <span className="font-medium text-white">{s.title}</span>,
    },
    {
      key: "sponsorName",
      header: "Sponsor",
      render: (s) => <span className="text-gray-400">{s.sponsorName}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (s) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {SPONSORSHIP_CATEGORY_LABELS[s.category as SponsorshipCategory] || s.category}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (s) => <span className="text-gray-400">${s.amount.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <SponsorshipStatusBadge status={s.status} />,
    },
    {
      key: "endDate",
      header: "End Date",
      render: (s) => <span className="text-gray-400">{s.endDate ? new Date(s.endDate).toLocaleDateString() : "-"}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sponsorships" description="Manage sponsorship opportunities" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value="-" icon={<Handshake className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Handshake className="h-5 w-5" />} />
          <StatCard title="Fulfilled" value="-" icon={<Handshake className="h-5 w-5" />} />
          <StatCard title="Cancelled" value="-" icon={<Handshake className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading sponsorships...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sponsorships" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Sponsorships"
          description="Manage sponsorship opportunities"
          actions={
            <Link
              href="/app/support-hub/sponsorships/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Sponsorship
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={<Handshake className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Handshake className="h-5 w-5" />} />
        <StatCard title="Fulfilled" value={stats.fulfilled} icon={<Handshake className="h-5 w-5" />} />
        <StatCard title="Cancelled" value={stats.cancelled} icon={<Handshake className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or sponsor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {SPONSORSHIP_STATUSES.map((s) => (
            <option key={s} value={s}>{SPONSORSHIP_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Categories</option>
          {SPONSORSHIP_CATEGORIES.map((c) => (
            <option key={c} value={c}>{SPONSORSHIP_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(s) => router.push(`/app/support-hub/sponsorships/${s.id}`)}
          emptyMessage="No sponsorships found."
        />
      </motion.div>
    </motion.div>
  )
}
