"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Search, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getCredentialRepositoryService } from "@/lib/services"
import type { CredentialFile } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function RepositoryPage() {
  const [files, setFiles] = useState<CredentialFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCredentialRepositoryService()
        const data = await svc.listFiles("tenant-1")
        if (!cancelled) setFiles(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load credential files")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!search) return
    let cancelled = false
    const fetch = async () => {
      try {
        const svc = await getCredentialRepositoryService()
        const data = await svc.searchFiles("tenant-1", search)
        if (!cancelled) setFiles(data)
      } catch {
        if (!cancelled) null
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [search])

  const stats = useMemo(() => ({
    total: files.length,
    idCards: files.filter((f) => f.credentialType === "id_card").length,
    certificates: files.filter((f) => f.credentialType === "certificate").length,
  }), [files])

  const columns: Column<CredentialFile>[] = [
    {
      key: "fileName",
      header: "File Name",
      render: (f) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#3CA4F9]" />
          <span className="text-white">{f.fileName}</span>
        </div>
      ),
    },
    {
      key: "fileType",
      header: "Type",
      render: (f) => (
        <span className="text-gray-300 uppercase text-xs">{f.fileType}</span>
      ),
    },
    {
      key: "credentialId",
      header: "Credential Reference",
      render: (f) => <span className="font-mono text-xs text-gray-400">{f.credentialId.slice(0, 8)}...</span>,
    },
    {
      key: "uploadedAt",
      header: "Upload Date",
      render: (f) => <span className="text-gray-400">{new Date(f.uploadedAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (f) => (
        <a
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3591E0] transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View
        </a>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credential Repository" description="Central credential document store" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Total Files" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="ID Cards" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Certificates" value="-" icon={<BookOpen className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading credential files...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credential Repository" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Credential Repository"
          description="Central credential document store"
          actions={
            <Link
              href="/app/credentials"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Files" value={stats.total} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="ID Cards" value={stats.idCards} icon={<BookOpen className="h-5 w-5 text-[#3CA4F9]" />} />
        <StatCard title="Certificates" value={stats.certificates} icon={<BookOpen className="h-5 w-5 text-green-400" />} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search files by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={files} emptyMessage="No credential files found." />
      </motion.div>
    </motion.div>
  )
}
