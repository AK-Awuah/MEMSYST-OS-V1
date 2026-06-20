"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, GraduationCap, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { SCHOLARSHIP_STATUSES, SCHOLARSHIP_STATUS_LABELS, SCHOLARSHIP_TYPE_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { Scholarship } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ScholarshipsPage() {
  const router = useRouter()
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.listScholarships("tenant-1", { status: "all" })
        if (!cancelled) setScholarships(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load scholarships")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: scholarships.length,
    open: scholarships.filter((s) => s.status === "open" || s.status === "accepting_applications").length,
    awarded: scholarships.filter((s) => s.status === "awarded").length,
  }), [scholarships])

  const filtered = useMemo(() => {
    let result = scholarships
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((sch) => sch.title.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((sch) => sch.status === statusFilter)
    }
    return result
  }, [search, statusFilter, scholarships])

  const columns: Column<Scholarship>[] = [
    {
      key: "title",
      header: "Title",
      render: (s) => <span className="font-medium text-white">{s.title}</span>,
    },
    {
      key: "scholarshipType",
      header: "Type",
      render: (s) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {SCHOLARSHIP_TYPE_LABELS[s.scholarshipType] || s.scholarshipType}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (s) => <span className="text-white">${s.amount.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "applicationDeadline",
      header: "Deadline",
      render: (s) => <span className="text-gray-400">{new Date(s.applicationDeadline).toLocaleDateString()}</span>,
    },
    {
      key: "totalSlots",
      header: "Slots",
      render: (s) => <span className="text-gray-400">{s.slotsFilled}/{s.totalSlots}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Scholarships" description="Manage scholarship programs and awards" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Scholarships" value="-" icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard title="Open / Accepting" value="-" icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard title="Awarded" value="-" icon={<GraduationCap className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading scholarships...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Scholarships" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Scholarships"
          description="Manage scholarship programs and awards"
          actions={
            <Link
              href="/app/support-hub/scholarships/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Scholarship
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Scholarships" value={stats.total} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Open / Accepting" value={stats.open} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Awarded" value={stats.awarded} icon={<GraduationCap className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title..."
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
          {SCHOLARSHIP_STATUSES.map((s) => (
            <option key={s} value={s}>{SCHOLARSHIP_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(s) => router.push(`/app/support-hub/scholarships/${s.id}`)}
          emptyMessage="No scholarships found."
        />
      </motion.div>
    </motion.div>
  )
}
