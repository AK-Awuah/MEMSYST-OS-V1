"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Loader2, ArrowUpRight } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getWalletService } from "@/lib/services"
import { WALLET_TYPE_LABELS, WALLET_STATUS_LABELS, WALLET_TYPES, WALLET_STATUSES } from "@/lib/constants"
import type { Wallet, WalletType, WalletStatus } from "@/types"

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function WalletsPage() {
  const router = useRouter()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getWalletService()
        const data = await svc.listWallets()
        setWallets(data)
      } catch {
        setError("Failed to load wallets")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: wallets.length,
    active: wallets.filter((w) => w.status === "active").length,
    totalBalance: wallets.reduce((s, w) => s + w.balance, 0),
    totalLocked: wallets.reduce((s, w) => s + w.lockedBalance, 0),
  }), [wallets])

  const filtered = useMemo(() => {
    let result = wallets
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((w) => w.ownerName.toLowerCase().includes(s) || w.id.toLowerCase().includes(s))
    }
    if (typeFilter !== "all") result = result.filter((w) => w.type === typeFilter)
    if (statusFilter !== "all") result = result.filter((w) => w.status === statusFilter)
    return result
  }, [wallets, search, typeFilter, statusFilter])

  const columns: Column<Wallet>[] = [
    { key: "ownerName", header: "Owner", render: (w) => <span className="font-medium text-white">{w.ownerName}</span> },
    { key: "type", header: "Type", render: (w) => <span className="text-sm capitalize">{WALLET_TYPE_LABELS[w.type as WalletType]}</span> },
    { key: "balance", header: "Balance", render: (w) => <span className="font-mono text-sm text-emerald-400">GHS {w.balance.toLocaleString()}</span> },
    { key: "lockedBalance", header: "Locked", render: (w) => <span className="font-mono text-sm text-amber-400">GHS {w.lockedBalance.toLocaleString()}</span> },
    { key: "currency", header: "Currency" },
    {
      key: "status", header: "Status", render: (w) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[w.status] || ""}`}>
          {WALLET_STATUS_LABELS[w.status as WalletStatus]}
        </span>
      ),
    },
    {
      key: "actions", header: "", render: (w) => (
        <button onClick={() => router.push(`/app/finance/wallets/${w.id}`)} className="text-[#3CA4F9] hover:underline text-xs flex items-center gap-1">
          View <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <p>{error}</p>
        <button onClick={() => setError("")} className="mt-2 text-sm underline">Dismiss</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Wallets" description="Manage all financial wallets on the platform" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Wallets</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold text-white mt-1">GHS {stats.totalBalance.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Locked Funds</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">GHS {stats.totalLocked.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search wallets..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Types</option>
          {WALLET_TYPES.map((t) => <option key={t} value={t}>{WALLET_TYPE_LABELS[t]}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {WALLET_STATUSES.map((s) => <option key={s} value={s}>{WALLET_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />
    </div>
  )
}
