"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { SUBSCRIPTION_PLAN_STATUS_LABELS } from "@/lib/constants"
import { getPlatformOpsService } from "@/lib/services"
import type { SubscriptionPlan } from "@/types"

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [monthlyPrice, setMonthlyPrice] = useState("0")
  const [maxMembers, setMaxMembers] = useState("10")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getPlatformOpsService()
        const data = await svc.listPlans()
        if (!cancelled) setPlans(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleAdd = async () => {
    if (!name) return
    setSaving(true)
    try {
      const svc = await getPlatformOpsService()
      await svc.createPlan({
        name, code: code || name.toLowerCase().replace(/\s+/g, "-"), description,
        monthlyPrice: parseFloat(monthlyPrice), maxMembers: parseInt(maxMembers, 10), maxBranches: 1, maxAdmins: 3,
        includedSMS: 100, includedEmail: 1000, storageGB: 5, status: "active", currency: "USD", features: [],
      })
      const data = await svc.listPlans()
      setPlans(data)
      setShowForm(false); setName(""); setCode(""); setDescription("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  const filtered = plans.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<SubscriptionPlan>[] = [
    { key: "name", header: "Name", render: (p) => <span className="text-white">{p.name}</span> },
    { key: "monthlyPrice", header: "Price", render: (p) => <span className="text-gray-400">${p.monthlyPrice}/mo</span> },
    { key: "maxMembers", header: "Max Members", render: (p) => <span className="text-gray-400">{p.maxMembers}</span> },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Subscription Plans" description="Manage pricing plans" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Plan
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search plans..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No plans found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Subscription Plan</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Code</label>
                  <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly Price ($)</label>
                  <input type="number" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} min="0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Members</label>
                  <input type="number" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} min="1" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !name}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
