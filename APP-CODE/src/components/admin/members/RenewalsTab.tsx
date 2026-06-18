"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import type { Member, RenewalRecord } from "@/types"
import { getRenewalService } from "@/lib/services"

export function RenewalsTab({ member }: { member: Member }) {
  const [renewals, setRenewals] = useState<RenewalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const svc = await getRenewalService()
      const data = await svc.getMemberRenewals(member.id)
      setRenewals(data)
      setLoading(false)
    }
    load()
  }, [member.id])

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Renewal History</h3>
        <span className="text-sm text-gray-500">Next renewal: {member.nextRenewalDate ? new Date(member.nextRenewalDate).toLocaleDateString() : "—"}</span>
      </div>

      {renewals.length === 0 && (
        <div className="flex flex-col items-center py-10 text-gray-500">
          <RefreshCw className="mb-2 h-10 w-10" />
          <p className="text-sm">No renewal records yet</p>
        </div>
      )}

      <div className="space-y-3">
        {renewals.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
            <div>
              <p className="text-sm text-white">Amount: GHS {r.amount}</p>
              <p className="text-xs text-gray-500">Expiry: {new Date(r.previousExpiryDate).toLocaleDateString()} → {new Date(r.newExpiryDate).toLocaleDateString()}</p>
              {r.paymentReference && <p className="text-xs text-gray-500">Ref: {r.paymentReference}</p>}
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === "renewed" ? "bg-green-500/20 text-green-400" : r.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : r.status === "verified" ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
