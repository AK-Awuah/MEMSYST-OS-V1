"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { BROADCAST_SCOPE_LABELS, NOTIFICATION_CHANNEL_LABELS, NOTIFICATION_CHANNELS } from "@/lib/constants"
import type { BroadcastScope, NotificationChannel } from "@/lib/constants"
import { Megaphone, ArrowLeft } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface Broadcast {
  id: string
  title: string
  message: string
  scope: string
  channels: string[]
  status: string
  sentCount: number
  date: string
}

const mockBroadcasts: Broadcast[] = [
  { id: "1", title: "National Executive Directive", message: "All branches must submit quarterly reports by end of month.", scope: "national", channels: ["email", "sms"], status: "sent", sentCount: 1250, date: "2025-06-15" },
  { id: "2", title: "Platform Maintenance", message: "Scheduled maintenance on June 20th from 2-4 AM.", scope: "platform", channels: ["email", "push", "in_app"], status: "sent", sentCount: 8500, date: "2025-06-14" },
  { id: "3", title: "Regional Meeting", message: "Regional chairs meeting scheduled for July 5th.", scope: "regional", channels: ["sms", "in_app"], status: "sent", sentCount: 340, date: "2025-06-13" },
  { id: "4", title: "Branch Performance Alert", message: "Several branches below performance targets for Q2.", scope: "branch", channels: ["email"], status: "draft", sentCount: 0, date: "2025-06-12" },
  { id: "5", title: "Executive Committee Resolution", message: "New policy on membership fee structure approved.", scope: "executive", channels: ["email", "sms", "push"], status: "sent", sentCount: 28, date: "2025-06-11" },
]

const scopes: BroadcastScope[] = ["platform", "national", "regional", "branch", "executive"]

export default function BroadcastsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [scope, setScope] = useState<BroadcastScope>("platform")
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>([])
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(mockBroadcasts)

  function toggleChannel(channel: NotificationChannel) {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  function handleSend() {
    if (!title || !message || selectedChannels.length === 0) return
    const newBroadcast: Broadcast = {
      id: String(Date.now()),
      title,
      message,
      scope,
      channels: selectedChannels,
      status: "sent",
      sentCount: 0,
      date: new Date().toISOString().split("T")[0],
    }
    setBroadcasts((prev) => [newBroadcast, ...prev])
    setTitle("")
    setMessage("")
    setScope("platform")
    setSelectedChannels([])
  }

  const columns: Column<Broadcast>[] = [
    { key: "title", header: "Title", render: (b) => <span className="text-sm font-medium text-white">{b.title}</span> },
    {
      key: "scope", header: "Scope", render: (b) => (
        <StatusBadge status={b.scope} />
      ),
    },
    {
      key: "channels", header: "Channels", render: (b) => (
        <div className="flex gap-1 flex-wrap">
          {b.channels.map((ch) => (
            <span key={ch} className="inline-block rounded-full border border-[#1e3a5f] bg-[#011B2B] px-2 py-0.5 text-xs text-gray-300">
              {NOTIFICATION_CHANNEL_LABELS[ch as NotificationChannel] || ch}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status", header: "Status", render: (b) => (
        <StatusBadge status={b.status} />
      ),
    },
    { key: "sentCount", header: "Sent Count", render: (b) => <span className="text-sm text-gray-400">{b.sentCount.toLocaleString()}</span> },
    { key: "date", header: "Date", render: (b) => <span className="text-xs text-gray-400">{b.date}</span> },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Executive Broadcasts"
          description="Send important announcements across the organization"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-[#3CA4F9]" /> New Broadcast
        </h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">Title</label>
            <input className="form-input" placeholder="Broadcast title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea className="form-input min-h-[100px] resize-y" placeholder="Broadcast message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Scope</label>
              <select className="form-input" value={scope} onChange={(e) => setScope(e.target.value as BroadcastScope)}>
                {scopes.map((s) => (
                  <option key={s} value={s}>{BROADCAST_SCOPE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Channels</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {NOTIFICATION_CHANNELS.map((ch) => (
                  <label key={ch} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(ch)}
                      onChange={() => toggleChannel(ch)}
                      className="rounded border-gray-600 bg-[#011B2B] text-[#3CA4F9]"
                    />
                    {NOTIFICATION_CHANNEL_LABELS[ch]}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleSend} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2 text-sm font-medium text-white hover:bg-[#3594e0] transition-colors">
            <Megaphone className="h-4 w-4" /> Send Broadcast
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={broadcasts} />
      </motion.div>
    </motion.div>
  )
}
