"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ClipboardList, Filter } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/admin"
import { getMarketplaceAuditService } from "@/lib/services"
import { MARKETPLACE_AUDIT_ACTIONS, MARKETPLACE_AUDIT_ACTION_LABELS } from "@/lib/constants"
import type { MarketplaceAuditLog } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function AuditPage() {
  const [logs, setLogs] = useState<MarketplaceAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionFilter, setActionFilter] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMarketplaceAuditService()
        const data = await svc.listAuditLogs("tenant-1")
        if (!cancelled) setLogs(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load audit logs")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filteredLogs = useMemo(() => {
    if (!actionFilter) return logs
    return logs.filter((l) => l.action === actionFilter)
  }, [logs, actionFilter])

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Audit Log" description="Track all marketplace actions" />
        <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E]">
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-[#1e3a5f] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Audit Log" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Marketplace Audit Log"
          description="Chronological record of all marketplace actions"
          actions={
            <Link
              href="/app/marketplace"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2.5 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
        >
          <option value="">All Actions</option>
          {MARKETPLACE_AUDIT_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {MARKETPLACE_AUDIT_ACTION_LABELS[action]}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{filteredLogs.length} entries</span>
      </motion.div>

      <motion.div variants={itemVariants} className="overflow-x-auto rounded-xl border border-[#1e3a5f] bg-[#011B2B]">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <ClipboardList className="h-10 w-10" />
            <p className="text-sm">No audit logs found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] text-left">
                <th className="px-4 py-3 font-medium text-gray-400">Timestamp</th>
                <th className="px-4 py-3 font-medium text-gray-400">Actor</th>
                <th className="px-4 py-3 font-medium text-gray-400">Action</th>
                <th className="px-4 py-3 font-medium text-gray-400">Record Type</th>
                <th className="px-4 py-3 font-medium text-gray-400">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0A1E2E]/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{log.actor}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-[#3CA4F9]/10 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9]">
                      {MARKETPLACE_AUDIT_ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{log.recordType.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                    {log.details || (
                      <span className="text-gray-600">
                        {log.previousValue && `From: ${log.previousValue}`}
                        {log.previousValue && log.newValue && " → "}
                        {log.newValue && `To: ${log.newValue}`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  )
}
