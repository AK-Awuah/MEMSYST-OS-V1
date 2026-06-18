"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, FileText, CheckCircle, DraftingCompass, Archive, Mail, Smartphone, Bell, MessageSquare } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { TEMPLATE_TYPE_LABELS, TEMPLATE_STATUS_LABELS } from "@/lib/constants"
import type { Template, TemplateType, TemplateStatus } from "@/types"

const mockTemplates: Template[] = [
  { id: "tpl-1", tenantId: "tenant-1", name: "Welcome Email", description: "New member welcome message", type: "email", subject: "Welcome to MEMSYST!", content: "<h1>Welcome {{name}}!</h1><p>We are excited to have you.</p>", variables: ["name", "email"], status: "active", createdBy: "Admin", createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "tpl-2", tenantId: "tenant-1", name: "Renewal Reminder SMS", description: "Membership renewal reminder", type: "sms", content: "Dear {{name}}, your membership expires on {{date}}. Renew now!", variables: ["name", "date"], status: "active", createdBy: "Admin", createdAt: "2025-01-20", updatedAt: "2025-01-20" },
  { id: "tpl-3", tenantId: "tenant-1", name: "Payment Confirmation", description: "Payment success notification", type: "email", subject: "Payment Confirmed", content: "<p>Thank you {{name}}, your payment of {{amount}} was successful.</p>", variables: ["name", "amount"], status: "draft", createdBy: "Manager", createdAt: "2025-02-01", updatedAt: "2025-02-01" },
  { id: "tpl-4", tenantId: "tenant-1", name: "Event Reminder Push", description: "Push notification for upcoming event", type: "push", content: "{{event_name}} starts in 1 hour! Don't miss it.", variables: ["event_name", "event_time"], status: "active", createdBy: "Marketing", createdAt: "2025-02-10", updatedAt: "2025-02-12" },
  { id: "tpl-5", tenantId: "tenant-1", name: "Apprentice Upgrade Notice", description: "Notice for apprentice level up", type: "notification", subject: "Congratulations!", content: "{{name}}, you have been upgraded to {{new_level}}!", variables: ["name", "new_level"], status: "archived", createdBy: "Admin", createdAt: "2024-12-01", updatedAt: "2025-01-05" },
  { id: "tpl-6", tenantId: "tenant-1", name: "Meeting Invitation", description: "Meeting invite template", type: "email", subject: "Invitation: {{meeting_topic}}", content: "<p>Dear {{name}}, you are invited to {{meeting_topic}} on {{date}}.</p>", variables: ["name", "meeting_topic", "date"], status: "draft", createdBy: "Manager", createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "tpl-7", tenantId: "tenant-1", name: "SMS Verification Code", description: "OTP verification message", type: "sms", content: "Your verification code is {{code}}. It expires in 10 minutes.", variables: ["code"], status: "active", createdBy: "System", createdAt: "2025-01-10", updatedAt: "2025-01-10" },
]

const typeIcons: Record<TemplateType, typeof FileText> = { email: Mail, sms: Smartphone, push: Bell, notification: MessageSquare }

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
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const stats = useMemo(() => ({
    total: mockTemplates.length,
    active: mockTemplates.filter((t) => t.status === "active").length,
    draft: mockTemplates.filter((t) => t.status === "draft").length,
    archived: mockTemplates.filter((t) => t.status === "archived").length,
  }), [])

  const filtered = useMemo(() => {
    let result = mockTemplates
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((t) => t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s))
    }
    if (typeFilter !== "all") result = result.filter((t) => t.type === typeFilter)
    return result
  }, [search, typeFilter])

  const columns: Column<Template>[] = [
    { key: "name", header: "Name", render: (t) => <span className="font-medium text-white">{t.name}</span> },
    { key: "type", header: "Type", render: (t) => {
      const Icon = typeIcons[t.type]
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9]">
          <Icon className="h-3 w-3" /> {TEMPLATE_TYPE_LABELS[t.type]}
        </span>
      )
    }},
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "variables", header: "Variables", render: (t) => <span className="text-gray-400">{t.variables.length}</span> },
    { key: "createdAt", header: "Created", render: (t) => <span className="text-gray-400">{t.createdAt}</span> },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Templates" description="Manage communication templates" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Templates" value={stats.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="Draft" value={stats.draft} icon={<DraftingCompass className="h-5 w-5" />} />
        <StatCard title="Archived" value={stats.archived} icon={<Archive className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Types</option>
          {(["email", "sms", "push", "notification"] as const).map((t) => <option key={t} value={t}>{TEMPLATE_TYPE_LABELS[t]}</option>)}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={filtered} onRowClick={(t) => router.push(`/app/communication/templates/${t.id}`)} emptyMessage="No templates found" />
      </motion.div>
    </motion.div>
  )
}
