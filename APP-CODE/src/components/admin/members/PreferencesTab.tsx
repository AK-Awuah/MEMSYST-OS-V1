"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, Bell, Mail, MessageSquare, Smartphone } from "lucide-react"
import type { Member, MemberCommunication } from "@/types"
import { getMemberCommunicationService } from "@/lib/services"

export function PreferencesTab({ member }: { member: Member }) {
  const [prefs, setPrefs] = useState<MemberCommunication | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const svc = await getMemberCommunicationService()
      const data = await svc.getPreferences(member.id)
      setPrefs(data)
      setLoading(false)
    }
    load()
  }, [member.id])

  async function toggle(key: keyof MemberCommunication) {
    if (!prefs) return
    const svc = await getMemberCommunicationService()
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    await svc.updatePreferences(member.id, { [key]: !prefs[key] } as Partial<MemberCommunication>)
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  const channels = [
    { key: "email" as const, label: "Email", icon: Mail, desc: "Receive notifications via email" },
    { key: "sms" as const, label: "SMS", icon: Smartphone, desc: "Receive notifications via text message" },
    { key: "push" as const, label: "Push", icon: Bell, desc: "Receive push notifications" },
    { key: "inApp" as const, label: "In-App", icon: MessageSquare, desc: "Receive in-app notifications" },
  ]

  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
      <h3 className="mb-6 text-lg font-semibold text-white">Communication Preferences</h3>
      <div className="space-y-4">
        {channels.map((ch) => {
          const Icon = ch.icon
          const isEnabled = prefs?.[ch.key] ?? true
          return (
            <div key={ch.key} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${isEnabled ? "text-[#3CA4F9]" : "text-gray-600"}`} />
                <div>
                  <p className="text-sm font-medium text-white">{ch.label}</p>
                  <p className="text-xs text-gray-500">{ch.desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(ch.key)}
                className={`relative h-6 w-11 rounded-full transition-colors ${isEnabled ? "bg-[#3CA4F9]" : "bg-[#1e3a5f]"}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${isEnabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
