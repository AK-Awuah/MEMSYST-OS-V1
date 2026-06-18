"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { PageHeader, StatCard } from "@/components/admin"
import { NOTIFICATION_CHANNEL_LABELS, DELIVERY_STATUS_LABELS } from "@/lib/constants"
import type { NotificationChannel } from "@/lib/constants"
import { ArrowLeft, Send, TrendingUp, Eye, MousePointerClick, Mail, MessageSquare, Bell, Smartphone, BarChart3 } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface CampaignSummary {
  name: string
  sent: number
  delivered: number
  opened: number
  clicked: number
}

const mockCampaigns: CampaignSummary[] = [
  { name: "June Membership Drive", sent: 8500, delivered: 7820, opened: 4230, clicked: 1250 },
  { name: "Renewal Campaign Q2", sent: 3200, delivered: 2980, opened: 1890, clicked: 890 },
  { name: "AGM 2025 Invitation", sent: 12000, delivered: 11200, opened: 6800, clicked: 2100 },
  { name: "Training Workshop", sent: 1500, delivered: 1420, opened: 980, clicked: 450 },
  { name: "New Member Onboarding", sent: 450, delivered: 440, opened: 380, clicked: 220 },
]

const channelStats = [
  { channel: "email" as NotificationChannel, count: 25600, icon: Mail, color: "text-[#3CA4F9]" },
  { channel: "sms" as NotificationChannel, count: 12400, icon: MessageSquare, color: "text-green-400" },
  { channel: "push" as NotificationChannel, count: 18900, icon: Bell, color: "text-purple-400" },
  { channel: "in_app" as NotificationChannel, count: 22300, icon: Smartphone, color: "text-amber-400" },
]

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="h-2 w-full rounded-full bg-[#1e3a5f] overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function AnalyticsPage() {
  const totals = useMemo(() => {
    const sent = mockCampaigns.reduce((s, c) => s + c.sent, 0)
    const delivered = mockCampaigns.reduce((s, c) => s + c.delivered, 0)
    const opened = mockCampaigns.reduce((s, c) => s + c.opened, 0)
    const clicked = mockCampaigns.reduce((s, c) => s + c.clicked, 0)
    return {
      sent,
      deliveryRate: sent > 0 ? ((delivered / sent) * 100).toFixed(1) : "0",
      openRate: delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0",
      clickRate: opened > 0 ? ((clicked / opened) * 100).toFixed(1) : "0",
    }
  }, [])

  const maxChannelCount = Math.max(...channelStats.map((c) => c.count))

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Communication Analytics"
          description="Performance metrics across all communication channels"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sent" value={totals.sent.toLocaleString()} icon={<Send className="h-5 w-5" />} />
        <StatCard title="Delivery Rate" value={`${totals.deliveryRate}%`} icon={<TrendingUp className="h-5 w-5 text-green-400" />} trend={{ value: "+2.3%", positive: true }} />
        <StatCard title="Open Rate" value={`${totals.openRate}%`} icon={<Eye className="h-5 w-5 text-[#3CA4F9]" />} trend={{ value: "+1.8%", positive: true }} />
        <StatCard title="Click Rate" value={`${totals.clickRate}%`} icon={<MousePointerClick className="h-5 w-5 text-purple-400" />} trend={{ value: "+0.9%", positive: true }} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#3CA4F9]" /> Channel Breakdown
          </h3>
          <div className="space-y-4">
            {channelStats.map((ch) => (
              <div key={ch.channel}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ch.icon className={`h-4 w-4 ${ch.color}`} />
                    <span className="text-sm text-gray-300">{NOTIFICATION_CHANNEL_LABELS[ch.channel]}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{ch.count.toLocaleString()}</span>
                </div>
                <ProgressBar value={ch.count} max={maxChannelCount} color="bg-[#3CA4F9]" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Top Campaigns
          </h3>
          <div className="space-y-4">
            {mockCampaigns.map((camp) => {
              const deliveryPct = camp.sent > 0 ? (camp.delivered / camp.sent) * 100 : 0
              const openPct = camp.delivered > 0 ? (camp.opened / camp.delivered) * 100 : 0
              const clickPct = camp.opened > 0 ? (camp.clicked / camp.opened) * 100 : 0
              return (
                <div key={camp.name} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
                  <p className="text-sm font-medium text-white mb-2">{camp.name}</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="text-white font-medium">{camp.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivered</p>
                      <p className="text-green-400 font-medium">{deliveryPct.toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Opened</p>
                      <p className="text-[#3CA4F9] font-medium">{openPct.toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-16">Delivery</span>
                      <ProgressBar value={camp.delivered} max={camp.sent} color="bg-green-400" />
                      <span className="text-gray-400 w-10 text-right">{deliveryPct.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-16">Open</span>
                      <ProgressBar value={camp.opened} max={camp.delivered} color="bg-[#3CA4F9]" />
                      <span className="text-gray-400 w-10 text-right">{openPct.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-16">Click</span>
                      <ProgressBar value={camp.clicked} max={camp.opened} color="bg-purple-400" />
                      <span className="text-gray-400 w-10 text-right">{clickPct.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
