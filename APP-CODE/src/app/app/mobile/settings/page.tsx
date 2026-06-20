"use client"

import { PageHeader } from "@/components/admin"

export default function MobileSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mobile Settings" description="Configure mobile platform preferences" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Mobile Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Enable offline mode</p>
              <p className="text-xs text-gray-500">Allow the app to work without internet connection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Push notifications</p>
              <p className="text-xs text-gray-500">Enable push notification support</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-[#1e3a5f] rounded-full peer peer-checked:bg-[#3CA4F9] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
            <div>
              <p className="text-sm font-medium text-white">Auto-update service worker</p>
              <p className="text-xs text-gray-500">Automatically update the service worker when available</p>
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
