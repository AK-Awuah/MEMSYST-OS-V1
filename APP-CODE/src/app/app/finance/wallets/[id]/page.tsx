"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Lock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { PageHeader } from "@/components/admin/PageHeader"
import { getWalletService, getLedgerService } from "@/lib/services"
import { WALLET_TYPE_LABELS, WALLET_STATUS_LABELS } from "@/lib/constants"
import type { Wallet, LedgerEntry, WalletType, WalletStatus } from "@/types"

export default function WalletDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [walletSvc, ledgerSvc] = await Promise.all([getWalletService(), getLedgerService()])
        const [w, l] = await Promise.all([
          walletSvc.getWallet(id),
          ledgerSvc.listEntries({ walletId: id, limit: 50 }),
        ])
        if (!w) { setError("Wallet not found"); return }
        setWallet(w)
        setLedger(l)
      } catch {
        setError("Failed to load wallet")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
      </div>
    )
  }

  if (error || !wallet) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <p>{error || "Wallet not found"}</p>
        <button onClick={() => router.back()} className="mt-2 text-sm underline">Go back</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Wallets
      </button>

      <PageHeader title={wallet.ownerName} description={`${WALLET_TYPE_LABELS[wallet.type as WalletType]} Wallet · ${wallet.id}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Wallet Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Current Balance</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">GHS {wallet.balance.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Locked Balance</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">GHS {wallet.lockedBalance.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold text-white mt-1">GHS {(wallet.balance - wallet.lockedBalance).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <p className={`text-lg font-bold mt-1 capitalize ${wallet.status === "active" ? "text-emerald-400" : "text-amber-400"}`}>{WALLET_STATUS_LABELS[wallet.status as WalletStatus]}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ledger Entries</h3>
            {ledger.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No ledger entries found.</p>
            ) : (
              <div className="space-y-2">
                {ledger.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-[#012a42]/30 border border-[#1e3a5f]">
                    <div>
                      <p className="text-sm text-white font-medium">{entry.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.referenceNumber} · {new Date(entry.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-400">GHS {entry.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{WALLET_TYPE_LABELS[wallet.type as WalletType]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Owner ID</span>
                <span className="text-white text-xs">{wallet.ownerId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Currency</span>
                <span className="text-white">{wallet.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Created</span>
                <span className="text-white text-xs">{new Date(wallet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f] text-sm text-white hover:bg-[#3CA4F9] transition-colors">
                <Lock className="w-4 h-4" /> Suspend Wallet
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f] text-sm text-white hover:bg-emerald-600 transition-colors">
                <CheckCircle className="w-4 h-4" /> Activate Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
