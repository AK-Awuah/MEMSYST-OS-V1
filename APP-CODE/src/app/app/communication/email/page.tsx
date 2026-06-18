"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { EMAIL_STATUS_LABELS } from "@/lib/constants"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface SentEmail {
  id: string
  to: string
  subject: string
  status: string
  sentAt: string
}

const mockEmails: SentEmail[] = [
  { id: "1", to: "john@example.com", subject: "Membership Renewal Notice", status: "delivered", sentAt: "2025-06-15 10:30 AM" },
  { id: "2", to: "jane@example.com", subject: "Welcome to the Association", status: "opened", sentAt: "2025-06-14 09:15 AM" },
  { id: "3", to: "bob@example.com", subject: "Event Invitation: AGM 2025", status: "sent", sentAt: "2025-06-13 14:00 PM" },
  { id: "4", to: "alice@example.com", subject: "Payment Confirmation", status: "clicked", sentAt: "2025-06-12 11:45 AM" },
  { id: "5", to: "sam@example.com", subject: "Certificate Issued", status: "failed", sentAt: "2025-06-11 08:20 AM" },
  { id: "6", to: "lisa@example.com", subject: "ID Card Ready for Pickup", status: "bounced", sentAt: "2025-06-10 16:30 PM" },
]

export default function EmailPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sent, setSent] = useState<SentEmail[]>(mockEmails)

  function handleSend() {
    if (!to || !subject || !body) return
    const newEmail: SentEmail = {
      id: String(Date.now()),
      to,
      subject,
      status: "sent",
      sentAt: new Date().toLocaleString(),
    }
    setSent((prev) => [newEmail, ...prev])
    setTo("")
    setSubject("")
    setBody("")
  }

  const columns: Column<SentEmail>[] = [
    { key: "to", header: "To", render: (e) => <span className="text-sm font-medium text-white">{e.to}</span> },
    { key: "subject", header: "Subject", render: (e) => <span className="text-sm text-gray-300">{e.subject}</span> },
    {
      key: "status", header: "Status", render: (e) => (
        <StatusBadge status={e.status} />
      ),
    },
    { key: "sentAt", header: "Sent At", render: (e) => <span className="text-xs text-gray-400">{e.sentAt}</span> },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Email Messages"
          description="Send and track email communications"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <Send className="h-5 w-5 text-[#3CA4F9]" /> Send Email
        </h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">To</label>
            <input className="form-input" placeholder="recipient@example.com" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="Email subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Body</label>
            <textarea className="form-input min-h-[120px] resize-y" placeholder="Write your message..." value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <button onClick={handleSend} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2 text-sm font-medium text-white hover:bg-[#3594e0] transition-colors">
            <Send className="h-4 w-4" /> Send Email
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={sent} />
      </motion.div>
    </motion.div>
  )
}
