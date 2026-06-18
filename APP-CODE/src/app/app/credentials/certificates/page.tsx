"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Award, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { CERTIFICATE_TYPE_LABELS, CERTIFICATE_TYPES } from "@/lib/constants"
import { getCertificateService } from "@/lib/services"
import type { Certificate } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function CertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCertificateService()
        const data = await svc.listCertificates("tenant-1")
        if (!cancelled) setCertificates(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load certificates")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: certificates.length,
    active: certificates.filter((c) => c.status === "active").length,
    unprinted: certificates.filter((c) => c.status === "unprinted").length,
    printed: certificates.filter((c) => c.status === "printed" || c.status === "reprinted").length,
  }), [certificates])

  const filtered = useMemo(() => {
    let result = certificates
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        (c) => c.recipientName.toLowerCase().includes(s) || c.certificateNumber.toLowerCase().includes(s)
      )
    }
    if (typeFilter !== "all") {
      result = result.filter((c) => c.certificateType === typeFilter)
    }
    return result
  }, [search, typeFilter, certificates])

  const columns: Column<Certificate>[] = [
    {
      key: "certificateNumber",
      header: "Certificate Number",
      render: (c) => <span className="font-medium text-white font-mono">{c.certificateNumber}</span>,
    },
    {
      key: "recipientName",
      header: "Recipient Name",
      render: (c) => <span className="text-white">{c.recipientName}</span>,
    },
    {
      key: "certificateType",
      header: "Type",
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {CERTIFICATE_TYPE_LABELS[c.certificateType] || c.certificateType}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (c) => <span className="text-gray-400">{new Date(c.issueDate).toLocaleDateString()}</span>,
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      render: (c) => <span className="text-gray-400">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "-"}</span>,
    },
    {
      key: "reprintCount",
      header: "Reprints",
      render: (c) => <span className="text-gray-400">{c.reprintCount}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Certificates" description="Issue and manage certificates" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Certificates" value="-" icon={<Award className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<Award className="h-5 w-5" />} />
          <StatCard title="Unprinted" value="-" icon={<Award className="h-5 w-5" />} />
          <StatCard title="Printed" value="-" icon={<Award className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading certificates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Certificates" />
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
          title="Certificates"
          description="Issue and manage certificates"
          actions={
            <Link
              href="/app/credentials/certificates/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Certificate
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Certificates" value={stats.total} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Unprinted" value={stats.unprinted} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Printed" value={stats.printed} icon={<Award className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or certificate number..."
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
          {CERTIFICATE_TYPES.map((t) => (
            <option key={t} value={t}>{CERTIFICATE_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(c) => router.push(`/app/credentials/certificates/${c.id}`)}
          emptyMessage="No certificates found."
        />
      </motion.div>
    </motion.div>
  )
}
