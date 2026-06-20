"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, Upload, ArrowLeft, Search, Archive, Trash2, Download } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getMemberDocumentService } from "@/lib/services"
import type { MemberDocument } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MemberDocumentsPage() {
  const router = useRouter()
  const [docs, setDocs] = useState<MemberDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [memberFilter, setMemberFilter] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMemberDocumentService()
        const data = await svc.listDocuments("tenant-1", memberFilter || "all")
        if (!cancelled) setDocs(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load documents")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [memberFilter])

  const filtered = search
    ? docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase()))
    : docs

  const columns: Column<MemberDocument>[] = [
    { key: "fileName", header: "File Name", render: (d) => <span className="font-medium text-white">{d.name}</span> },
    { key: "documentType", header: "Type", render: (d) => <span className="capitalize text-gray-400">{d.type.replace(/_/g, " ")}</span> },
    { key: "memberId", header: "Member", render: (d) => <span className="font-mono text-xs text-[#3CA4F9]">{d.memberId}</span> },
    { key: "status", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
    { key: "createdAt", header: "Uploaded", render: (d) => <span className="text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</span> },
    { key: "actions", header: "", render: (d) => (
      <div className="flex gap-1">
        <button className="rounded-md p-1.5 text-gray-500 hover:bg-[#1e3a5f]/50 hover:text-white transition-colors"><Download className="h-3.5 w-3.5" /></button>
        <button className="rounded-md p-1.5 text-gray-500 hover:bg-[#1e3a5f]/50 hover:text-yellow-400 transition-colors"><Archive className="h-3.5 w-3.5" /></button>
        <button className="rounded-md p-1.5 text-gray-500 hover:bg-[#1e3a5f]/50 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    )},
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Member Documents"
          description="Manage supporting documents for members"
          actions={
            <div className="flex gap-2">
              <Link
                href="/app/members"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3CA4F9]/90">
                <Upload className="h-4 w-4" />
                Upload Document
              </button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by member ID..."
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          className="w-48 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No documents found." />
      </motion.div>
    </motion.div>
  )
}
