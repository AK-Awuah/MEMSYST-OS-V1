"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/admin"
import { NOTIFICATION_CHANNEL_LABELS } from "@/lib/constants"
import { ArrowLeft, Mail, MessageSquare, Bell, Smartphone } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

interface MemberPreference {
  id: string
  name: string
  email: string
  phone: string
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
  in_app_enabled: boolean
}

const mockPreferences: MemberPreference[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+233 50 123 4567", email_enabled: true, sms_enabled: true, push_enabled: false, in_app_enabled: true },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+233 54 987 6543", email_enabled: true, sms_enabled: false, push_enabled: true, in_app_enabled: true },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "+233 55 456 7890", email_enabled: false, sms_enabled: true, push_enabled: true, in_app_enabled: false },
  { id: "4", name: "Alice Williams", email: "alice@example.com", phone: "+233 24 321 0987", email_enabled: true, sms_enabled: true, push_enabled: true, in_app_enabled: true },
  { id: "5", name: "Sam Brown", email: "sam@example.com", phone: "+233 20 111 2222", email_enabled: false, sms_enabled: false, push_enabled: false, in_app_enabled: true },
  { id: "6", name: "Lisa Davis", email: "lisa@example.com", phone: "+233 27 333 4444", email_enabled: true, sms_enabled: true, push_enabled: true, in_app_enabled: false },
]

const channels = [
  { key: "email_enabled" as const, label: NOTIFICATION_CHANNEL_LABELS.email, icon: Mail },
  { key: "sms_enabled" as const, label: NOTIFICATION_CHANNEL_LABELS.sms, icon: MessageSquare },
  { key: "push_enabled" as const, label: NOTIFICATION_CHANNEL_LABELS.push, icon: Bell },
  { key: "in_app_enabled" as const, label: NOTIFICATION_CHANNEL_LABELS.in_app, icon: Smartphone },
]

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#3CA4F9]" : "bg-[#1e3a5f]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export default function PreferencesPage() {
  const [members, setMembers] = useState<MemberPreference[]>(mockPreferences)

  function toggle(memberId: string, channel: keyof MemberPreference) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, [channel]: !m[channel] } : m
      )
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Communication Preferences"
          description="Manage member notification channel preferences"
          actions={
            <Link href="/app/communication" className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="overflow-x-auto rounded-xl border border-[#1e3a5f]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#1e3a5f] bg-[#011B2B]">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-400">Member</th>
              <th className="px-4 py-3 font-medium text-gray-400">Email</th>
              <th className="px-4 py-3 font-medium text-gray-400">Phone</th>
              {channels.map((ch) => (
                <th key={ch.key} className="px-4 py-3 font-medium text-gray-400 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ch.icon className="h-3.5 w-3.5" />
                    {ch.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]">
            {members.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-[#1e3a5f]/30">
                <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{m.email}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{m.phone}</td>
                {channels.map((ch) => (
                  <td key={ch.key} className="px-4 py-3 text-center">
                    <Toggle
                      enabled={m[ch.key] as boolean}
                      onChange={() => toggle(m.id, ch.key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
