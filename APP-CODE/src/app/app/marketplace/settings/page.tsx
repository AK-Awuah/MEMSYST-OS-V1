"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft, Settings, ToggleLeft, Hash, Eye, ShieldCheck,
  Building2, Globe, Save,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/admin"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function MarketplaceSettingsPage() {
  const [approvalRequired, setApprovalRequired] = useState(true)
  const [autoPublishVerifiedBusinesses, setAutoPublishVerifiedBusinesses] = useState(true)
  const [marketplaceEnabled, setMarketplaceEnabled] = useState(true)
  const [businessVerificationRequired, setBusinessVerificationRequired] = useState(true)
  const [allowMemberDirectoryVisibility, setAllowMemberDirectoryVisibility] = useState(true)
  const [defaultListingDurationDays, setDefaultListingDurationDays] = useState(30)
  const [maxImagesPerListing, setMaxImagesPerListing] = useState(10)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    console.log("Marketplace settings saved:", {
      approvalRequired,
      autoPublishVerifiedBusinesses,
      marketplaceEnabled,
      businessVerificationRequired,
      allowMemberDirectoryVisibility,
      defaultListingDurationDays,
      maxImagesPerListing,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Marketplace Settings"
          description="Configure marketplace behaviour and policies"
          actions={
            <Link
              href="/app/marketplace"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#3CA4F9]" /> General Settings
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
            <div className="flex items-start gap-3">
              <ToggleLeft className="mt-0.5 h-5 w-5 text-[#3CA4F9]" />
              <div>
                <p className="text-sm font-medium text-white">Approval Required</p>
                <p className="text-xs text-gray-400">New listings require admin approval before publishing</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={approvalRequired} onChange={(e) => setApprovalRequired(e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[#1e3a5f] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-gray-400 after:transition-all peer-checked:bg-[#3CA4F9] peer-checked:after:translate-x-full peer-checked:after:bg-white" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Auto-Publish Verified Businesses</p>
                <p className="text-xs text-gray-400">Automatically publish listings from verified businesses</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={autoPublishVerifiedBusinesses} onChange={(e) => setAutoPublishVerifiedBusinesses(e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[#1e3a5f] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-gray-400 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">Marketplace Enabled</p>
                <p className="text-xs text-gray-400">Enable or disable the entire marketplace module</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={marketplaceEnabled} onChange={(e) => setMarketplaceEnabled(e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[#1e3a5f] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-gray-400 after:transition-all peer-checked:bg-purple-500 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm font-medium text-white">Business Verification Required</p>
                <p className="text-xs text-gray-400">Businesses must be verified before they can list products or services</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={businessVerificationRequired} onChange={(e) => setBusinessVerificationRequired(e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[#1e3a5f] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-gray-400 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
            <div className="flex items-start gap-3">
              <Eye className="mt-0.5 h-5 w-5 text-pink-400" />
              <div>
                <p className="text-sm font-medium text-white">Allow Member Directory Visibility</p>
                <p className="text-xs text-gray-400">Members can control their visibility in the marketplace directory</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={allowMemberDirectoryVisibility} onChange={(e) => setAllowMemberDirectoryVisibility(e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[#1e3a5f] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-gray-400 after:transition-all peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <Hash className="h-5 w-5 text-[#3CA4F9]" />
                <p className="text-sm font-medium text-white">Default Listing Duration (Days)</p>
              </div>
              <input
                type="number"
                min={1}
                max={365}
                value={defaultListingDurationDays}
                onChange={(e) => setDefaultListingDurationDays(Number(e.target.value))}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <Hash className="h-5 w-5 text-[#3CA4F9]" />
                <p className="text-sm font-medium text-white">Max Images Per Listing</p>
              </div>
              <input
                type="number"
                min={1}
                max={50}
                value={maxImagesPerListing}
                onChange={(e) => setMaxImagesPerListing(Number(e.target.value))}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-emerald-400 animate-pulse">Settings saved</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
