"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft, Search, Flag, Ban, Trash2, ShieldAlert, Clock, AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/admin"
import { getMarketplaceComplianceService } from "@/lib/services"
import { MARKETPLACE_LISTING_STATUS_LABELS } from "@/lib/constants"
import type { MarketplaceListing, MarketplaceModerationRecord } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

type ActionModal = {
  listingId: string
  listingTitle: string
  action: "flag" | "suspend" | "remove"
} | null

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-400/10",
  draft: "text-gray-400 bg-gray-400/10",
  pending_review: "text-yellow-400 bg-yellow-400/10",
  approved: "text-cyan-400 bg-cyan-400/10",
  rejected: "text-red-400 bg-red-400/10",
  expired: "text-orange-400 bg-orange-400/10",
  archived: "text-gray-500 bg-gray-500/10",
}

export default function CompliancePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [moderationHistory, setModerationHistory] = useState<MarketplaceModerationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [actionModal, setActionModal] = useState<ActionModal>(null)
  const [actionReason, setActionReason] = useState("")
  const [actionProcessing, setActionProcessing] = useState(false)
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const svc = await getMarketplaceComplianceService()
      const [listingsData, historyData] = await Promise.all([
        svc.getAllListings(),
        svc.getModerationHistory(),
      ])
      setListings(listingsData)
      setModerationHistory(historyData)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load compliance data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filteredListings = useMemo(() => {
    let result = [...listings]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.tenantId.toLowerCase().includes(q) || l.memberId.toLowerCase().includes(q)
      )
    }
    if (statusFilter) {
      result = result.filter((l) => l.status === statusFilter)
    }
    return result
  }, [listings, search, statusFilter])

  const handleAction = async () => {
    if (!actionModal || !actionReason.trim()) return
    try {
      setActionProcessing(true)
      const svc = await getMarketplaceComplianceService()
      const { listingId, action } = actionModal
      const performedBy = "Admin User"
      const performedById = "admin-1"
      if (action === "flag") {
        await svc.flagListing(listingId, actionReason, performedBy, performedById)
      } else if (action === "suspend") {
        await svc.suspendListing(listingId, actionReason, performedBy, performedById)
      } else if (action === "remove") {
        await svc.removeListing(listingId, actionReason, performedBy, performedById)
      }
      setActionMsg({ type: "success", text: `Listing ${action}ned successfully` })
      setActionModal(null)
      setActionReason("")
      fetchData()
    } catch (e) {
      setActionMsg({ type: "error", text: e instanceof Error ? e.message : "Action failed" })
    } finally {
      setActionProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compliance & Moderation" description="Platform-wide listing moderation" />
        <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E]">
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-[#1e3a5f] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compliance & Moderation" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Compliance & Moderation"
          description="Review, flag, suspend, or remove listings across all tenants"
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

      {actionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-4 text-sm ${
            actionMsg.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {actionMsg.text}
          <button onClick={() => setActionMsg(null)} className="ml-3 underline opacity-70 hover:opacity-100">Dismiss</button>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title, tenant, or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2.5 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Object.entries(MARKETPLACE_LISTING_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="overflow-x-auto rounded-xl border border-[#1e3a5f] bg-[#011B2B]">
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <ShieldAlert className="h-10 w-10" />
            <p className="text-sm">No listings found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] text-left">
                <th className="px-4 py-3 font-medium text-gray-400">Title</th>
                <th className="px-4 py-3 font-medium text-gray-400">Tenant</th>
                <th className="px-4 py-3 font-medium text-gray-400">Member</th>
                <th className="px-4 py-3 font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 font-medium text-gray-400">Created</th>
                <th className="px-4 py-3 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/50">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-[#0A1E2E]/50 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{listing.title}</td>
                  <td className="px-4 py-3 text-gray-300">{listing.tenantId}</td>
                  <td className="px-4 py-3 text-gray-300">{listing.memberId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status] || "text-gray-400 bg-gray-400/10"}`}>
                      {MARKETPLACE_LISTING_STATUS_LABELS[listing.status] || listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(listing.createdDate || listing.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActionModal({ listingId: listing.id, listingTitle: listing.title, action: "flag" })}
                        className="flex items-center gap-1 rounded-lg border border-yellow-500/30 px-2.5 py-1.5 text-xs text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                      >
                        <Flag className="h-3.5 w-3.5" /> Flag
                      </button>
                      <button
                        onClick={() => setActionModal({ listingId: listing.id, listingTitle: listing.title, action: "suspend" })}
                        className="flex items-center gap-1 rounded-lg border border-orange-500/30 px-2.5 py-1.5 text-xs text-orange-400 hover:bg-orange-500/10 transition-colors"
                      >
                        <Ban className="h-3.5 w-3.5" /> Suspend
                      </button>
                      <button
                        onClick={() => setActionModal({ listingId: listing.id, listingTitle: listing.title, action: "remove" })}
                        className="flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#3CA4F9]" /> Moderation History
        </h3>
        {moderationHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No moderation actions recorded yet</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {moderationHistory.map((record) => (
              <div key={record.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    record.action === "removed" ? "bg-red-500/20 text-red-400" :
                    record.action === "suspended" ? "bg-orange-500/20 text-orange-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {record.action === "flagged" ? "F" : record.action === "suspended" ? "S" : "R"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">{record.action}</p>
                    <p className="text-xs text-gray-400">{record.reason}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{record.performedBy}</p>
                  <p>{new Date(record.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-xl border border-[#1e3a5f] bg-[#011B2B] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className={`h-6 w-6 ${
                actionModal.action === "remove" ? "text-red-400" :
                actionModal.action === "suspend" ? "text-orange-400" :
                "text-yellow-400"
              }`} />
              <div>
                <h3 className="text-lg font-semibold text-white capitalize">{actionModal.action} Listing</h3>
                <p className="text-sm text-gray-400">{actionModal.listingTitle}</p>
              </div>
            </div>
            <textarea
              placeholder="Enter reason for this action..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] p-3 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setActionModal(null); setActionReason("") }}
                className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={!actionReason.trim() || actionProcessing}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {actionProcessing ? "Processing..." : `Confirm ${actionModal.action}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
