"use client"

import { PageHeader, StatCard } from "@/components/admin"

export default function AnalyticsSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics Settings" description="Configure analytics and reporting preferences" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Default Report Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Auto-generate scheduled reports</p>
              <p className="text-xs text-gray-500">Automatically generate reports based on their schedule</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Email report notifications</p>
              <p className="text-xs text-gray-500">Send email notifications when reports are generated</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Compress report files</p>
              <p className="text-xs text-gray-500">Compress generated reports to reduce file size</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Default Report Format</label>
          <select defaultValue="pdf" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Rows Per Report</label>
          <input type="number" defaultValue={10000} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Data Retention (days)</label>
          <input type="number" defaultValue={90} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>
    </div>
  )
}
