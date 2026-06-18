"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, FileText, Search } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { CREDENTIAL_TEMPLATE_TYPES, CREDENTIAL_TEMPLATE_TYPE_LABELS } from "@/lib/constants"
import { getCredentialTemplateService } from "@/lib/services"
import type { CredentialTemplate } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<CredentialTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCredentialTemplateService()
        const data = await svc.listTemplates("tenant-1")
        if (!cancelled) setTemplates(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load templates")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (typeFilter === "all") return templates
    return templates.filter((t) => t.type === typeFilter)
  }, [typeFilter, templates])

  const columns: Column<CredentialTemplate>[] = [
    {
      key: "name",
      header: "Name",
      render: (t) => <span className="font-medium text-white">{t.name}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {CREDENTIAL_TEMPLATE_TYPE_LABELS[t.type] || t.type}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "version",
      header: "Version",
      render: (t) => <span className="text-gray-400">v{t.version}</span>,
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (t) => <span className="text-gray-400">{new Date(t.updatedAt).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Templates" description="Design card and certificate templates" />
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading templates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Templates" />
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
          title="Templates"
          description="Design card and certificate templates"
          actions={
            <Link
              href="/app/credentials/templates/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Template
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Types</option>
          {CREDENTIAL_TEMPLATE_TYPES.map((t) => (
            <option key={t} value={t}>{CREDENTIAL_TEMPLATE_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(t) => router.push(`/app/credentials/templates/${t.id}`)}
          emptyMessage="No templates found."
        />
      </motion.div>
    </motion.div>
  )
}
