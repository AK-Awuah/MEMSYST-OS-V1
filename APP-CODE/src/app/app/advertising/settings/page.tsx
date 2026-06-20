"use client"

import { PageHeader, StatCard } from "@/components/admin"

export default function AdvertisingSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Advertising Settings" description="Configure advertising platform preferences" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Ads" value="8" subtitle="Currently running" />
        <StatCard title="Active Campaigns" value="3" subtitle="In progress" />
        <StatCard title="Sponsor Deals" value="4" subtitle="Active partnerships" />
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Advertising Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Auto-approve ads</p>
              <p className="text-xs text-gray-500">Automatically approve advertisements without review</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Require approval for campaigns</p>
              <p className="text-xs text-gray-500">Campaigns must be reviewed before launching</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Enable ad placement analytics</p>
              <p className="text-xs text-gray-500">Track impressions, clicks, and conversions</p>
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
