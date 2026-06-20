"use client"

import { useState, useEffect } from "react"
import { Search, Download, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getEventsService } from "@/lib/services"
import type { EventCertificate } from "@/types"

export default function CertificatesListPage() {
  const [certificates, setCertificates] = useState<EventCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        const svc = await getEventsService()
        const data = await svc.listCertificates("all", "tenant-1")
        if (!cancelled) setCertificates(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = certificates.filter((c) =>
    c.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<EventCertificate>[] = [
    { key: "memberName", header: "Member", render: (c) => <span className="text-white">{c.memberName}</span> },
    { key: "eventId", header: "Event", render: (c) => <span className="text-gray-400 font-mono text-xs">{c.eventId.slice(0, 12)}...</span> },
    { key: "issuedAt", header: "Issued", render: (c) => <span className="text-gray-400">{new Date(c.issuedAt).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    {
      key: "actions", header: "", render: (c) => c.certificateUrl ? (
        <a
          href={c.certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#3CA4F9]/20 text-[#3CA4F9] text-xs hover:bg-[#3CA4F9]/30 transition-colors"
        >
          <Download className="h-3 w-3" /> Download
        </a>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Event Certificates" description="View and manage issued certificates" />

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by member name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" />
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No certificates issued yet." />
        </div>
      )}
    </div>
  )
}
