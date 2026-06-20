"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ArrowUp, ArrowDown, XCircle } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { PREMIUM_TIER_LABELS } from "@/lib/constants"
import { getTieringService } from "@/lib/services"
import type { PremiumAccount, PremiumTier } from "@/types"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<PremiumAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTieringService()
        const data = await svc.listAccounts("tenant-1")
        if (!cancelled) setAccounts(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleUpgrade = async (id: string, currentTier: PremiumTier) => {
    const tiers: PremiumTier[] = ["free", "basic", "premium", "enterprise"]
    const idx = tiers.indexOf(currentTier)
    if (idx >= tiers.length - 1) return
    setActionId(id)
    try {
      const svc = await getTieringService()
      await svc.upgradeAccount(id, tiers[idx + 1])
      setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, tier: tiers[idx + 1] } : a))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to upgrade")
    } finally {
      setActionId(null)
    }
  }

  const handleDowngrade = async (id: string, currentTier: PremiumTier) => {
    const tiers: PremiumTier[] = ["free", "basic", "premium", "enterprise"]
    const idx = tiers.indexOf(currentTier)
    if (idx <= 0) return
    setActionId(id)
    try {
      const svc = await getTieringService()
      await svc.downgradeAccount(id, tiers[idx - 1])
      setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, tier: tiers[idx - 1] } : a))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to downgrade")
    } finally {
      setActionId(null)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this premium account?")) return
    setActionId(id)
    try {
      const svc = await getTieringService()
      await svc.cancelAccount(id)
      setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" as const } : a))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to cancel")
    } finally {
      setActionId(null)
    }
  }

  const filtered = accounts.filter((a) =>
    a.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<PremiumAccount>[] = [
    { key: "memberName", header: "Member", render: (a) => <span className="text-white">{a.memberName}</span> },
    { key: "tier", header: "Tier", render: (a) => <span className="text-gray-400 capitalize">{PREMIUM_TIER_LABELS[a.tier]}</span> },
    { key: "startDate", header: "Start", render: (a) => <span className="text-gray-400 text-xs">{new Date(a.startDate).toLocaleDateString()}</span> },
    { key: "expiryDate", header: "Expires", render: (a) => <span className="text-gray-400 text-xs">{a.expiryDate ? new Date(a.expiryDate).toLocaleDateString() : "-"}</span> },
    { key: "autoRenew", header: "Auto-Renew", render: (a) => <span className={a.autoRenew ? "text-green-400" : "text-gray-500"}>{a.autoRenew ? "Yes" : "No"}</span> },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "actions", header: "", render: (a) =>
        a.status === "active" ? (
          <div className="flex gap-1.5">
            <button onClick={() => handleUpgrade(a.id, a.tier)} disabled={actionId === a.id || a.tier === "enterprise"}
              className="p-1.5 rounded-md bg-blue-600/40 text-blue-400 hover:bg-blue-500/60 transition-colors disabled:opacity-50" title="Upgrade">
              {actionId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => handleDowngrade(a.id, a.tier)} disabled={actionId === a.id || a.tier === "free"}
              className="p-1.5 rounded-md bg-yellow-600/40 text-yellow-400 hover:bg-yellow-500/60 transition-colors disabled:opacity-50" title="Downgrade">
              {actionId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowDown className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => handleCancel(a.id)} disabled={actionId === a.id}
              className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors disabled:opacity-50" title="Cancel">
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Premium Accounts" description="Manage premium tier accounts" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search accounts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No premium accounts found." />
        </div>
      )}
    </div>
  )
}
