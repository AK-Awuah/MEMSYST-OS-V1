"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, History } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { NOTIFICATION_CHANNEL_LABELS, COMMUNICATION_AUDIT_ACTION_LABELS } from "@/lib/constants"
import type { CommunicationAuditLog, CommunicationAuditAction, NotificationChannel } from "@/types"

const mockAuditLogs: CommunicationAuditLog[] = [
  { id: "aud-1", tenantId: "tenant-1", actor: "Admin User", action: "message_sent", channel: "email", audience: "All Active Members", result: "success", createdAt: "2025-06-16T09:30:00Z" },
  { id: "aud-2", tenantId: "tenant-1", actor: "System", action: "campaign_created", channel: "push", audience: "New Apprentices", result: "success", createdAt: "2025-06-16T08:15:00Z" },
  { id: "aud-3", tenantId: "tenant-1", actor: "Manager", action: "template_modified", channel: "sms", result: "success", createdAt: "2025-06-15T14:45:00Z" },
  { id: "aud-4", tenantId: "tenant-1", actor: "Member Portal", action: "preference_changed", channel: "in_app", audience: "john@example.com", result: "success", createdAt: "2025-06-15T11:20:00Z" },
  { id: "aud-5", tenantId: "tenant-1", actor: "Admin User", action: "broadcast_sent", channel: "email", audience: "All Members", result: "success", createdAt: "2025-06-14T16:00:00Z" },
  { id: "aud-6", tenantId: "tenant-1", actor: "System", action: "message_sent", channel: "sms", audience: "Renewal Due Next Month", result: "failure", createdAt: "2025-06-14T10:30:00Z" },
  { id: "aud-7", tenantId: "tenant-1", actor: "Marketing", action: "campaign_sent", channel: "email", audience: "Event Attendees", result: "success", createdAt: "2025-06-13T09:00:00Z" },
  { id: "aud-8", tenantId: "tenant-1", actor: "Member Portal", action: "subscription_changed", channel: "in_app", audience: "jane@example.com", result: "success", createdAt: "2025-06-12T19:15:00Z" },
  { id: "aud-9", tenantId: "tenant-1", actor: "Admin User", action: "automation_created", channel: "email", result: "success", createdAt: "2025-06-12T13:00:00Z" },
  { id: "aud-10", tenantId: "tenant-1", actor: "System", action: "automation_toggled", channel: "push", result: "failure", createdAt: "2025-06-11T08:45:00Z" },
  { id: "aud-11", tenantId: "tenant-1", actor: "Manager", action: "message_created", channel: "push", audience: "Executives & Leaders", result: "success", createdAt: "2025-06-11T07:30:00Z" },
  { id: "aud-12", tenantId: "tenant-1", actor: "Admin User", action: "template_modified", channel: "email", result: "success", createdAt: "2025-06-10T15:20:00Z" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const defaultChannel = "email" as NotificationChannel

export default function AuditPage() {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filtered = useMemo(() => {
    let result = mockAuditLogs
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((log) => log.actor.toLowerCase().includes(s) || (log.audience && log.audience.toLowerCase().includes(s)))
    }
    if (actionFilter !== "all") result = result.filter((log) => log.action === actionFilter)
    if (channelFilter !== "all") result = result.filter((log) => log.channel === channelFilter)
    if (dateFrom) result = result.filter((log) => log.createdAt >= dateFrom)
    if (dateTo) result = result.filter((log) => log.createdAt <= dateTo + "T23:59:59Z")
    return result
  }, [search, actionFilter, channelFilter, dateFrom, dateTo])

  const columns: Column<CommunicationAuditLog>[] = [
    { key: "createdAt", header: "Timestamp", render: (log) => {
      const d = new Date(log.createdAt)
      return <span className="text-sm text-gray-300">{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
    }},
    { key: "actor", header: "Actor", render: (log) => <span className="text-white">{log.actor}</span> },
    { key: "action", header: "Action", render: (log) => <span className="text-gray-200">{COMMUNICATION_AUDIT_ACTION_LABELS[log.action as CommunicationAuditAction] || log.action}</span> },
    { key: "channel", header: "Channel", render: (log) => (
      <span className="inline-block rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9]">
        {NOTIFICATION_CHANNEL_LABELS[log.channel as NotificationChannel] || log.channel}
      </span>
    )},
    { key: "audience", header: "Audience", render: (log) => <span className="text-gray-400">{log.audience || "-"}</span> },
    { key: "result", header: "Result", render: (log) => (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${log.result === "success" ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
        {log.result === "success" ? "Success" : "Failure"}
      </span>
    )},
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Communication Audit Log" description="Track all communication actions" />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search by actor or audience..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Actions</option>
          {(["message_created", "message_sent", "campaign_created", "campaign_sent", "template_modified", "preference_changed", "subscription_changed", "broadcast_sent", "automation_created", "automation_modified", "automation_toggled"] as const).map((a) => (
            <option key={a} value={a}>{COMMUNICATION_AUDIT_ACTION_LABELS[a]}</option>
          ))}
        </select>
        <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Channels</option>
          {(["email", "sms", "push", "in_app"] as const).map((c) => (
            <option key={c} value={c}>{NOTIFICATION_CHANNEL_LABELS[c]}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white [color-scheme:dark]" placeholder="From date" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white [color-scheme:dark]" placeholder="To date" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} emptyMessage="No audit logs found" />
      </motion.div>
    </motion.div>
  )
}
