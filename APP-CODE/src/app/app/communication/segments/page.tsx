"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Users, Target, Filter } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import type { AudienceSegment } from "@/types"

const mockSegments: AudienceSegment[] = [
  { id: "seg-1", tenantId: "tenant-1", name: "All Active Members", description: "All currently active members", filters: [{ field: "status", operator: "eq", value: "active" }], estimatedCount: 1250, createdBy: "Admin", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "seg-2", tenantId: "tenant-1", name: "Renewal Due Next Month", description: "Members whose membership expires within 30 days", filters: [{ field: "renewalDate", operator: "gte", value: "2025-06-01" }, { field: "renewalDate", operator: "lte", value: "2025-06-30" }], estimatedCount: 340, createdBy: "Manager", createdAt: "2025-02-15", updatedAt: "2025-02-15" },
  { id: "seg-3", tenantId: "tenant-1", name: "Overdue Renewals", description: "Members with expired membership", filters: [{ field: "status", operator: "eq", value: "expired" }], estimatedCount: 87, createdBy: "Admin", createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "seg-4", tenantId: "tenant-1", name: "New Apprentices", description: "Apprentices registered in last 90 days", filters: [{ field: "category", operator: "eq", value: "apprentice" }, { field: "createdAt", operator: "gte", value: "2025-03-01" }], estimatedCount: 56, createdBy: "Training", createdAt: "2025-03-10", updatedAt: "2025-03-10" },
  { id: "seg-5", tenantId: "tenant-1", name: "Executives & Leaders", description: "All executive committee members", filters: [{ field: "role", operator: "eq", value: "executive" }], estimatedCount: 24, createdBy: "Admin", createdAt: "2025-01-20", updatedAt: "2025-01-20" },
  { id: "seg-6", tenantId: "tenant-1", name: "Inactive Members", description: "Suspended or inactive members", filters: [{ field: "status", operator: "in", value: ["inactive", "suspended"] }], estimatedCount: 112, createdBy: "Manager", createdAt: "2025-04-01", updatedAt: "2025-04-01" },
  { id: "seg-7", tenantId: "tenant-1", name: "Event Attendees Q2", description: "Members who attended Q2 events", filters: [{ field: "events", operator: "contains", value: "q2_2025" }], estimatedCount: 410, createdBy: "Marketing", createdAt: "2025-04-15", updatedAt: "2025-04-15" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SegmentsPage() {
  const [search, setSearch] = useState("")

  const stats = useMemo(() => ({
    total: mockSegments.length,
    totalAudience: mockSegments.reduce((sum, s) => sum + s.estimatedCount, 0),
  }), [])

  const filtered = useMemo(() => {
    if (!search) return mockSegments
    const s = search.toLowerCase()
    return mockSegments.filter((seg) => seg.name.toLowerCase().includes(s) || seg.description.toLowerCase().includes(s))
  }, [search])

  const columns: Column<AudienceSegment>[] = [
    { key: "name", header: "Name", render: (s) => <span className="font-medium text-white">{s.name}</span> },
    { key: "description", header: "Description", render: (s) => <span className="text-gray-400">{s.description}</span> },
    { key: "filters", header: "Filters", render: (s) => <span className="text-gray-400">{s.filters.length}</span> },
    { key: "estimatedCount", header: "Estimated Count", render: (s) => <span className="font-mono text-sm text-[#3CA4F9]">{s.estimatedCount.toLocaleString()}</span> },
    { key: "createdAt", header: "Created", render: (s) => <span className="text-gray-400">{s.createdAt}</span> },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Audience Segments" description="Define and manage audience segments" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard title="Total Segments" value={stats.total} icon={<Target className="h-5 w-5" />} />
        <StatCard title="Total Estimated Audience" value={stats.totalAudience.toLocaleString()} icon={<Users className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search segments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} emptyMessage="No segments found" />
      </motion.div>
    </motion.div>
  )
}
