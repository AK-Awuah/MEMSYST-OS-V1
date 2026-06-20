"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getPlatformOpsService } from "@/lib/services"
import type { TenantSubscription } from "@/types"

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<TenantSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getPlatformOpsService()
        const data = await svc.listSubscriptions()
        if (!cancelled) setSubscriptions(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = subscriptions.filter((s) =>
    s.planName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<TenantSubscription>[] = [
    { key: "planName", header: "Plan", render: (s) => <span className="text-white">{s.planName}</span> },
    { key: "billingCycle", header: "Billing", render: (s) => <span className="text-gray-400 capitalize">{s.billingCycle}</span> },
    { key: "amount", header: "Amount", render: (s) => <span className="text-gray-400">${s.amount}</span> },
    { key: "startDate", header: "Start", render: (s) => <span className="text-gray-400 text-xs">{new Date(s.startDate).toLocaleDateString()}</span> },
    { key: "endDate", header: "End", render: (s) => <span className="text-gray-400 text-xs">{s.endDate ? new Date(s.endDate).toLocaleDateString() : "-"}</span> },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status.replace(/_/g, "-")} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Tenant Subscriptions" description="Tenant subscription management" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search subscriptions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No subscriptions found." />
        </div>
      )}
    </div>
  )
}
