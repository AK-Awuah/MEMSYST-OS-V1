"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Search, FileType } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import {
  CONTENT_TYPES,
  CONTENT_TYPE_LABELS,
} from "@/lib/constants"
import { getContentService } from "@/lib/services"
import type { LearningContent, ContentType } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function ContentTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    document: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    video: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    image: "bg-green-500/15 text-green-400 border-green-500/30",
    assignment: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    reference: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  }
  const c = colors[type] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = CONTENT_TYPE_LABELS[type as ContentType] || type.replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      <FileType className="h-3 w-3" />
      {label}
    </span>
  )
}

function ContentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-green-500/15 text-green-400 border-green-500/30",
    archived: "bg-gray-700/30 text-gray-500 border-gray-600/40",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function ContentPage() {
  const router = useRouter()
  const [contents, setContents] = useState<LearningContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getContentService()
        const data = await svc.listContent("tenant-1")
        if (!cancelled) setContents(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load content")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: contents.length,
    published: contents.filter((c) => c.status === "published").length,
    archived: contents.filter((c) => c.status === "archived").length,
  }), [contents])

  const filtered = useMemo(() => {
    let result = contents
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s))
    }
    if (typeFilter !== "all") {
      result = result.filter((c) => c.contentType === typeFilter)
    }
    return result
  }, [search, typeFilter, contents])

  const columns: Column<LearningContent>[] = [
    {
      key: "title",
      header: "Title",
      render: (c) => <span className="font-medium text-white">{c.title}</span>,
    },
    {
      key: "contentType",
      header: "Type",
      render: (c) => <ContentTypeBadge type={c.contentType} />,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <ContentStatusBadge status={c.status} />,
    },
    {
      key: "fileSize",
      header: "Size",
      render: (c) => <span className="text-gray-400">{c.fileSize ? `${(c.fileSize / 1024).toFixed(0)} KB` : "-"}</span>,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (c) => <span className="text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Learning Content" description="Manage learning content library" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Published" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Archived" value="-" icon={<BookOpen className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Learning Content" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Learning Content"
          description="Manage learning content library"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Published" value={stats.published} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Archived" value={stats.archived} icon={<BookOpen className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search content by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Types</option>
          {CONTENT_TYPES.map((t) => (
            <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(c) => router.push(`/app/training/content/${c.id}`)}
          emptyMessage="No content found."
        />
      </motion.div>
    </motion.div>
  )
}
