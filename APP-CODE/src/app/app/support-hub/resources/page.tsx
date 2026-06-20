"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Plus, Search, CheckCircle, XCircle } from "lucide-react"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { RESOURCE_CATEGORIES, RESOURCE_CATEGORY_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { ResourceDirectory, ResourceCategory } from "@/types"

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

export default function ResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState<ResourceDirectory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.listResources("tenant-1")
        if (!cancelled) setResources(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load resources")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: resources.length,
    published: resources.filter((r) => r.status === "published").length,
    verified: resources.filter((r) => r.isVerified).length,
  }), [resources])

  const filtered = useMemo(() => {
    let result = resources
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((r) =>
        r.title.toLowerCase().includes(s) ||
        r.provider.toLowerCase().includes(s) ||
        r.tags.some((t) => t.toLowerCase().includes(s))
      )
    }
    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter)
    }
    return result
  }, [search, categoryFilter, resources])

  const columns: Column<ResourceDirectory>[] = [
    { key: "title", header: "Title", render: (r) => <span className="font-medium text-white">{r.title}</span> },
    { key: "provider", header: "Provider", render: (r) => <span className="text-gray-400">{r.provider}</span> },
    {
      key: "category",
      header: "Category",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9]">
          {RESOURCE_CATEGORY_LABELS[r.category as ResourceCategory] || r.category}
        </span>
      ),
    },
    {
      key: "isVerified",
      header: "Verified",
      render: (r) => r.isVerified ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400"><CheckCircle className="h-3.5 w-3.5" /> Yes</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500"><XCircle className="h-3.5 w-3.5" /> No</span>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "tags",
      header: "Tags",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded bg-[#1e3a5f]/50 px-1.5 py-0.5 text-xs text-gray-400">{t}</span>
          ))}
          {r.tags.length > 3 && <span className="text-xs text-gray-500">+{r.tags.length - 3}</span>}
        </div>
      ),
    },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Resources"
          description="Manage resource directory entries."
          actions={
            <Link
              href="/app/support-hub/resources/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Resource
            </Link>
          }
        />
      </motion.div>

      {error && (
        <motion.div variants={itemVariants} className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Total Resources" value={stats.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Published" value={stats.published} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Verified" value={stats.verified} icon={<CheckCircle className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title, provider, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
        >
          <option value="all">All Categories</option>
          {RESOURCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{RESOURCE_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          isLoading={loading}
          onRowClick={(r) => router.push(`/app/support-hub/resources/${r.id}`)}
          emptyMessage="No resources found."
        />
      </motion.div>
    </motion.div>
  )
}
