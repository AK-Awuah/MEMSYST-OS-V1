"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, BookOpen, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getProgramService } from "@/lib/services"
import type { Program } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ProgramsPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getProgramService()
        const data = await svc.listPrograms("tenant-1")
        if (!cancelled) setPrograms(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load programs")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: programs.length,
    active: programs.filter((p) => p.status === "active").length,
    inactive: programs.filter((p) => p.status === "inactive").length,
  }), [programs])

  const filtered = useMemo(() => {
    let result = programs
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }
    return result
  }, [search, statusFilter, programs])

  const columns: Column<Program>[] = [
    {
      key: "name",
      header: "Name",
      render: (p) => <span className="font-medium text-white">{p.name}</span>,
    },
    {
      key: "levels",
      header: "Levels",
      render: (p) => <span className="text-gray-400">{p.levels.length} levels</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
          p.status === "active"
            ? "bg-green-500/15 text-green-400 border-green-500/30"
            : "bg-gray-500/15 text-gray-400 border-gray-500/30"
        }`}>
          {p.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "requirements",
      header: "Requirements",
      render: (p) => <span className="text-gray-400">{p.requirements.length}</span>,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (p) => <span className="text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Programs" description="Manage training programs" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Inactive" value="-" icon={<BookOpen className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading programs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Programs" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Programs"
          description="Manage training programs"
          actions={
            <Link
              href="/app/training/programs/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Program
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Inactive" value={stats.inactive} icon={<BookOpen className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search programs by name or description..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(p) => router.push(`/app/training/programs/${p.id}`)}
          emptyMessage="No programs found."
        />
      </motion.div>
    </motion.div>
  )
}
