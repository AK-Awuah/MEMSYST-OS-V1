"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { SMS_STATUS_LABELS } from "@/lib/constants"
import { MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface SentSMS {
  id: string
  to: string
  message: string
  units: number
  status: string
  sentAt: string
}

const mockSMS: SentSMS[] = [
  { id: "1", to: "+233 50 123 4567", message: "Your membership renewal is due. Please pay by 30th June.", units: 1, status: "delivered", sentAt: "2025-06-15 10:30 AM" },
  { id: "2", to: "+233 54 987 6543", message: "Welcome to the association! Your ID card is being processed.", units: 2, status: "sent", sentAt: "2025-06-14 09:15 AM" },
  { id: "3", to: "+233 55 456 7890", message: "AGM 2025 is scheduled for July 15th. Please confirm attendance.", units: 2, status: "delivered", sentAt: "2025-06-13 14:00 PM" },
  { id: "4", to: "+233 24 321 0987", message: "Your certificate has been issued. Download from the portal.", units: 1, status: "failed", sentAt: "2025-06-12 11:45 AM" },
  { id: "5", to: "+233 20 111 2222", message: "Payment of GHS 500 received successfully. Thank you!", units: 1, status: "delivered", sentAt: "2025-06-11 08:20 AM" },
]

export default function SMSPage() {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState<SentSMS[]>(mockSMS)

  const charLimit = 160
  const remaining = charLimit - message.length
  const units = Math.max(1, Math.ceil(message.length / charLimit))

  function handleSend() {
    if (!phone || !message) return
    const newSMS: SentSMS = {
      id: String(Date.now()),
      to: phone,
      message,
      units: Math.ceil(message.length / charLimit) || 1,
      status: "sent",
      sentAt: new Date().toLocaleString(),
    }
    setSent((prev) => [newSMS, ...prev])
    setPhone("")
    setMessage("")
  }

  const columns: Column<SentSMS>[] = [
    { key: "to", header: "To", render: (s) => <span className="text-sm font-medium text-white">{s.to}</span> },
    {
      key: "message", header: "Message", render: (s) => (
        <span className="text-sm text-gray-300 truncate max-w-[250px] inline-block">
          {s.message.length > 50 ? s.message.slice(0, 50) + "..." : s.message}
        </span>
      ),
    },
    { key: "units", header: "Units", render: (s) => <span className="text-sm text-gray-400">{s.units}</span> },
    {
      key: "status", header: "Status", render: (s) => (
        <StatusBadge status={s.status} />
      ),
    },
    { key: "sentAt", header: "Sent At", render: (s) => <span className="text-xs text-gray-400">{s.sentAt}</span> },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="SMS Messages"
          description="Send and track SMS communications"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#3CA4F9]" /> Send SMS
        </h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="+233 50 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea
              className="form-input min-h-[100px] resize-y"
              placeholder="Type your SMS message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={charLimit * 5}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className={`${remaining < 20 ? "text-amber-400" : "text-gray-500"}`}>
                {remaining} characters remaining
              </span>
              <span className="text-gray-500">{units} SMS unit{units > 1 ? "s" : ""}</span>
            </div>
          </div>
          <button onClick={handleSend} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2 text-sm font-medium text-white hover:bg-[#3594e0] transition-colors">
            <MessageSquare className="h-4 w-4" /> Send SMS
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={sent} />
      </motion.div>
    </motion.div>
  )
}
