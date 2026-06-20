"use client"

import { useState, useEffect } from "react"
import { PageHeader, StatCard } from "@/components/admin"
import { GovernanceConfig } from "@/types"
import { getGovernanceEnhancedService } from "@/lib/services"

export default function GovernanceSettingsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title="Governance Settings" description="Configure governance platform settings" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Election Term Limit" value="2 terms" subtitle="Maximum consecutive terms" />
        <StatCard title="Voting Method" value="Simple Majority" subtitle="Default voting method" />
        <StatCard title="Committee Quorum" value="50% + 1" subtitle="Default quorum requirement" />
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Governance Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Auto-archive completed elections</p>
              <p className="text-xs text-gray-500">Automatically archive elections 30 days after completion</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Require 2FA for voting</p>
              <p className="text-xs text-gray-500">Enforce two-factor authentication for casting votes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Public election results</p>
              <p className="text-xs text-gray-500">Make election results visible to all members</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Defaults for New Elections</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nomination Period (days)</label>
            <input type="number" defaultValue={14} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Campaign Period (days)</label>
            <input type="number" defaultValue={7} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Voting Period (days)</label>
            <input type="number" defaultValue={3} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
