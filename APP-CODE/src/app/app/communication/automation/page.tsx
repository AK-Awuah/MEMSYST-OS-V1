"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { PageHeader, StatCard, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { AUTOMATION_TRIGGER_LABELS, AUTOMATION_ACTION_LABELS, NOTIFICATION_CHANNEL_LABELS } from "@/lib/constants"
import type { AutomationTriggerEvent, AutomationActionType, NotificationChannel } from "@/lib/constants"
import { Zap, ArrowLeft, Activity, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface AutomationRule {
  id: string
  name: string
  triggerEvent: string
  actionType: string
  channel: string
  active: boolean
  createdAt: string
}

const mockRules: AutomationRule[] = [
  { id: "1", name: "Welcome New Member", triggerEvent: "member.approved", actionType: "send_email", channel: "email", active: true, createdAt: "2025-01-15" },
  { id: "2", name: "Renewal Reminder", triggerEvent: "renewal.due", actionType: "send_email", channel: "email", active: true, createdAt: "2025-02-10" },
  { id: "3", name: "Payment Confirmation SMS", triggerEvent: "payment.successful", actionType: "send_sms", channel: "sms", active: true, createdAt: "2025-03-05" },
  { id: "4", name: "Certificate Notification", triggerEvent: "certificate.issued", actionType: "send_in_app", channel: "in_app", active: false, createdAt: "2025-03-20" },
  { id: "5", name: "Overdue Alert", triggerEvent: "renewal.overdue", actionType: "send_sms", channel: "sms", active: true, createdAt: "2025-04-01" },
  { id: "6", name: "ID Card Ready Push", triggerEvent: "id_card.ready", actionType: "send_push", channel: "push", active: false, createdAt: "2025-04-15" },
  { id: "7", name: "Executive Appointed", triggerEvent: "executive.appointed", actionType: "send_email", channel: "email", active: true, createdAt: "2025-05-01" },
  { id: "8", name: "Apprentice Upgraded", triggerEvent: "apprentice.upgraded", actionType: "send_in_app", channel: "in_app", active: true, createdAt: "2025-05-15" },
]

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules)

  const stats = useMemo(() => ({
    total: rules.length,
    active: rules.filter((r) => r.active).length,
    inactive: rules.filter((r) => !r.active).length,
  }), [rules])

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r))
  }

  const columns: Column<AutomationRule>[] = [
    { key: "name", header: "Name", render: (r) => <span className="text-sm font-medium text-white">{r.name}</span> },
    {
      key: "triggerEvent", header: "Trigger Event", render: (r) => (
        <span className="text-sm text-gray-300">{AUTOMATION_TRIGGER_LABELS[r.triggerEvent as AutomationTriggerEvent] || r.triggerEvent}</span>
      ),
    },
    {
      key: "actionType", header: "Action", render: (r) => (
        <span className="text-sm text-gray-300">{AUTOMATION_ACTION_LABELS[r.actionType as AutomationActionType] || r.actionType}</span>
      ),
    },
    {
      key: "channel", header: "Channel", render: (r) => (
        <span className="inline-block rounded-full border border-[#1e3a5f] bg-[#011B2B] px-2 py-0.5 text-xs text-gray-300">
          {NOTIFICATION_CHANNEL_LABELS[r.channel as NotificationChannel] || r.channel}
        </span>
      ),
    },
    {
      key: "active", header: "Status", render: (r) => (
        <button onClick={() => toggleRule(r.id)} className="flex items-center gap-2">
          {r.active ? (
            <>
              <span className="inline-block rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">Active</span>
              <ToggleRight className="h-5 w-5 text-green-400" />
            </>
          ) : (
            <>
              <span className="inline-block rounded-full border border-gray-500/30 bg-gray-500/15 px-2.5 py-0.5 text-xs font-medium text-gray-400">Inactive</span>
              <ToggleLeft className="h-5 w-5 text-gray-500" />
            </>
          )}
        </button>
      ),
    },
    { key: "createdAt", header: "Created", render: (r) => <span className="text-xs text-gray-400">{r.createdAt}</span> },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Automation Rules"
          description="Configure automated communication workflows"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Total Rules" value={stats.total} icon={<Zap className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<Activity className="h-5 w-5 text-green-400" />} subtitle={`${((stats.active / stats.total) * 100).toFixed(0)}% of total`} />
        <StatCard title="Inactive" value={stats.inactive} icon={<ToggleLeft className="h-5 w-5 text-gray-400" />} subtitle={`${((stats.inactive / stats.total) * 100).toFixed(0)}% of total`} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={rules} />
      </motion.div>
    </motion.div>
  )
}
