"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, ArrowLeft, Save, Mail, MessageCircle, Bell, Smartphone } from "lucide-react"
import { PageHeader } from "@/components/admin"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MemberCommunicationPage() {
  const [memberId, setMemberId] = useState("")
  const [preferences, setPreferences] = useState({ email: true, sms: false, push: true, inApp: true })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Member Communication"
          description="Manage member communication preferences"
          actions={
            <Link
              href="/app/members"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 p-6 backdrop-blur-md">
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Member ID</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter a member ID to manage preferences..."
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <h3 className="mb-4 text-sm font-semibold text-white">Communication Channels</h3>
        <div className="mb-6 space-y-3">
          {[
            { key: "email", label: "Email", icon: <Mail className="h-4 w-4" />, desc: "Receive emails for notifications and campaigns" },
            { key: "sms", label: "SMS", icon: <MessageCircle className="h-4 w-4" />, desc: "Receive text messages for urgent alerts" },
            { key: "push", label: "Push Notifications", icon: <Bell className="h-4 w-4" />, desc: "Receive push notifications on mobile" },
            { key: "inApp", label: "In-App", icon: <Smartphone className="h-4 w-4" />, desc: "Receive in-app notification center alerts" },
          ].map((channel) => (
            <label key={channel.key} className="flex items-center justify-between rounded-lg border border-[#1e3a5f]/30 bg-[#012a42]/50 p-4 transition-colors hover:border-[#3CA4F9]/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3CA4F9]/10 text-[#3CA4F9]">{channel.icon}</div>
                <div>
                  <p className="text-sm font-medium text-white">{channel.label}</p>
                  <p className="text-xs text-gray-400">{channel.desc}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences[channel.key as keyof typeof preferences]}
                onChange={() => setPreferences((p) => ({ ...p, [channel.key]: !p[channel.key as keyof typeof preferences] }))}
                className="h-5 w-5 rounded border-[#1e3a5f] bg-[#011B2B] text-[#3CA4F9] focus:ring-[#3CA4F9]"
              />
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3CA4F9]/90"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </motion.div>
    </motion.div>
  )
}
