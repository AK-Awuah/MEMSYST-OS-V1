"use client"

import { PageHeader, StatCard } from "@/components/admin"

export default function PlatformOpsSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Operations Settings" description="Configure platform operations" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Subscriptions" value="12" subtitle="Currently active" />
        <StatCard title="Open Tickets" value="3" subtitle="Awaiting response" />
        <StatCard title="Active Partners" value="5" subtitle="Platform partners" />
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Operations Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Auto-renew subscriptions</p>
              <p className="text-xs text-gray-500">Automatically renew subscriptions at end of billing cycle</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Auto-escalate tickets</p>
              <p className="text-xs text-gray-500">Escalate tickets that exceed SLA duration</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Send invoice reminders</p>
              <p className="text-xs text-gray-500">Send payment reminders 7 days before due date</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
