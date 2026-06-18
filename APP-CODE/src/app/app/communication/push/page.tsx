"use client"

import { motion } from "framer-motion"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { PUSH_STATUS_LABELS } from "@/lib/constants"
import { Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface PushNotification {
  id: string
  title: string
  body: string
  status: string
  recipient: string
  sentAt: string
}

const mockPush: PushNotification[] = [
  { id: "1", title: "Renewal Reminder", body: "Your membership renewal is due in 7 days. Please renew to continue enjoying benefits.", status: "delivered", recipient: "All Members", sentAt: "2025-06-15 10:30 AM" },
  { id: "2", title: "New Event Posted", body: "Annual General Meeting 2025 has been scheduled. Register now!", status: "sent", recipient: "Active Members", sentAt: "2025-06-14 09:15 AM" },
  { id: "3", title: "Certificate Ready", body: "Your professional certificate has been issued and is available for download.", status: "opened", recipient: "John Doe", sentAt: "2025-06-13 14:00 PM" },
  { id: "4", title: "Payment Received", body: "Your payment of GHS 500 has been confirmed.", status: "delivered", recipient: "Jane Smith", sentAt: "2025-06-12 11:45 AM" },
  { id: "5", title: "ID Card Available", body: "Your membership ID card is ready for collection at the branch.", status: "failed", recipient: "Bob Johnson", sentAt: "2025-06-11 08:20 AM" },
  { id: "6", title: "Executive Announcement", body: "New executive committee members have been appointed for the 2025-2027 term.", status: "delivered", recipient: "All Members", sentAt: "2025-06-10 16:30 PM" },
]

export default function PushPage() {
  const columns: Column<PushNotification>[] = [
    { key: "title", header: "Title", render: (p) => <span className="text-sm font-medium text-white">{p.title}</span> },
    {
      key: "body", header: "Body", render: (p) => (
        <span className="text-sm text-gray-300 truncate max-w-[300px] inline-block">
          {p.body.length > 60 ? p.body.slice(0, 60) + "..." : p.body}
        </span>
      ),
    },
    {
      key: "status", header: "Status", render: (p) => (
        <StatusBadge status={p.status} />
      ),
    },
    { key: "recipient", header: "Recipient", render: (p) => <span className="text-sm text-gray-400">{p.recipient}</span> },
    { key: "sentAt", header: "Sent At", render: (p) => <span className="text-xs text-gray-400">{p.sentAt}</span> },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Push Notifications"
          description="Manage push notification delivery"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={mockPush} />
      </motion.div>
    </motion.div>
  )
}
