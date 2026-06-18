"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, CheckCircle, Archive, RotateCcw, Mail, Smartphone, Bell, MessageSquare, Variable } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { TEMPLATE_TYPE_LABELS } from "@/lib/constants"
import type { Template, TemplateType } from "@/types"

const mockTemplates: Template[] = [
  { id: "tpl-1", tenantId: "tenant-1", name: "Welcome Email", description: "New member welcome message", type: "email", subject: "Welcome to MEMSYST!", content: "<h1>Welcome {{name}}!</h1><p>We are excited to have you.</p>", variables: ["name", "email"], status: "active", createdBy: "Admin", createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "tpl-2", tenantId: "tenant-1", name: "Renewal Reminder SMS", description: "Membership renewal reminder", type: "sms", content: "Dear {{name}}, your membership expires on {{date}}. Renew now!", variables: ["name", "date"], status: "active", createdBy: "Admin", createdAt: "2025-01-20", updatedAt: "2025-01-20" },
  { id: "tpl-3", tenantId: "tenant-1", name: "Payment Confirmation", description: "Payment success notification", type: "email", subject: "Payment Confirmed", content: "<p>Thank you {{name}}, your payment of {{amount}} was successful.</p>", variables: ["name", "amount"], status: "draft", createdBy: "Manager", createdAt: "2025-02-01", updatedAt: "2025-02-01" },
  { id: "tpl-4", tenantId: "tenant-1", name: "Event Reminder Push", description: "Push notification for upcoming event", type: "push", content: "{{event_name}} starts in 1 hour! Don't miss it.", variables: ["event_name", "event_time"], status: "active", createdBy: "Marketing", createdAt: "2025-02-10", updatedAt: "2025-02-12" },
  { id: "tpl-5", tenantId: "tenant-1", name: "Apprentice Upgrade Notice", description: "Notice for apprentice level up", type: "notification", subject: "Congratulations!", content: "{{name}}, you have been upgraded to {{new_level}}!", variables: ["name", "new_level"], status: "archived", createdBy: "Admin", createdAt: "2024-12-01", updatedAt: "2025-01-05" },
  { id: "tpl-6", tenantId: "tenant-1", name: "Meeting Invitation", description: "Meeting invite template", type: "email", subject: "Invitation: {{meeting_topic}}", content: "<p>Dear {{name}}, you are invited to {{meeting_topic}} on {{date}}.</p>", variables: ["name", "meeting_topic", "date"], status: "draft", createdBy: "Manager", createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "tpl-7", tenantId: "tenant-1", name: "SMS Verification Code", description: "OTP verification message", type: "sms", content: "Your verification code is {{code}}. It expires in 10 minutes.", variables: ["code"], status: "active", createdBy: "System", createdAt: "2025-01-10", updatedAt: "2025-01-10" },
]

const typeIcons: Record<TemplateType, typeof Mail> = { email: Mail, sms: Smartphone, push: Bell, notification: MessageSquare }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TemplateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const template = useMemo(() => mockTemplates.find((t) => t.id === params.id), [params.id])
  const [cloned, setCloned] = useState(false)

  if (!template) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.push("/app/communication/templates")} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </button>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Template not found.</p>
        </div>
      </div>
    )
  }

  const Icon = typeIcons[template.type]

  function handleStatusToggle() {
    // Mock action — would call API in real app
  }

  function handleClone() {
    setCloned(true)
    setTimeout(() => setCloned(false), 2000)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <button onClick={() => router.push("/app/communication/templates")} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PageHeader
          title={template.name}
          description={template.description}
          actions={
            <div className="flex flex-wrap gap-2">
              {template.status === "archived" ? (
                <button onClick={handleStatusToggle} className="flex items-center gap-1.5 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">
                  <RotateCcw className="h-4 w-4" /> Restore
                </button>
              ) : template.status === "active" ? (
                <button onClick={handleStatusToggle} className="flex items-center gap-1.5 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">
                  <Archive className="h-4 w-4" /> Archive
                </button>
              ) : (
                <button onClick={handleStatusToggle} className="flex items-center gap-1.5 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] transition-colors">
                  <CheckCircle className="h-4 w-4" /> Activate
                </button>
              )}
              <button onClick={handleClone} className="flex items-center gap-1.5 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">
                <Copy className="h-4 w-4" /> {cloned ? "Cloned!" : "Clone"}
              </button>
            </div>
          }
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#011B2B]/60 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Template Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-[#3CA4F9]" />
                  <span className="text-sm text-white">{TEMPLATE_TYPE_LABELS[template.type]}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={template.status} /></div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="mt-1 text-sm text-gray-300">{template.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created By</p>
                <p className="mt-1 text-sm text-white">{template.createdBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="mt-1 text-sm text-gray-300">{template.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="mt-1 text-sm text-gray-300">{template.updatedAt}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1e3a5f] bg-[#011B2B]/60 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              Variables <span className="text-gray-500">({template.variables.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-1 text-xs font-mono text-[#3CA4F9]">
                  <Variable className="h-3 w-3" /> {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#011B2B]/60 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Content Preview</h3>
            <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-5">
              {template.subject && (
                <div className="mb-4 border-b border-[#1e3a5f] pb-4">
                  <p className="text-xs text-gray-500 mb-1">Subject</p>
                  <p className="text-sm font-medium text-white">{template.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-2">Body</p>
                <div className="rounded-lg bg-[#0a1e30] p-4 text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {template.content}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
