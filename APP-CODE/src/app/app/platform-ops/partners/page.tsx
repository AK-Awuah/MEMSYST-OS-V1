"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Ban } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getPlatformOpsService } from "@/lib/services"
import type { PlatformPartner } from "@/types"

export default function PartnersPage() {
  const [partners, setPartners] = useState<PlatformPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [partnerType, setPartnerType] = useState<PlatformPartner["partnerType"]>("technology")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [commissionRate, setCommissionRate] = useState("0")
  const [saving, setSaving] = useState(false)
  const [suspendingId, setSuspendingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getPlatformOpsService()
        const data = await svc.listPartners()
        if (!cancelled) setPartners(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleSuspend = async (id: string) => {
    if (!confirm("Suspend this partner?")) return
    setSuspendingId(id)
    try {
      const svc = await getPlatformOpsService()
      await svc.suspendPartner(id)
      setPartners((prev) => prev.map((p) => p.id === id ? { ...p, status: "suspended" as const } : p))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to suspend")
    } finally {
      setSuspendingId(null)
    }
  }

  const handleAdd = async () => {
    if (!name) return
    setSaving(true)
    try {
      const svc = await getPlatformOpsService()
      await svc.createPartner({
        name, partnerType, contactName, contactEmail,
        commissionRate: parseFloat(commissionRate), revenueShare: 0,
        status: "active", contractStart: new Date().toISOString(),
      })
      const data = await svc.listPartners()
      setPartners(data)
      setShowForm(false); setName(""); setContactName(""); setContactEmail("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<PlatformPartner>[] = [
    { key: "name", header: "Name", render: (p) => <span className="text-white">{p.name}</span> },
    { key: "partnerType", header: "Type", render: (p) => <span className="text-gray-400 capitalize">{p.partnerType.replace(/_/g, " ")}</span> },
    { key: "contactName", header: "Contact", render: (p) => <span className="text-gray-400">{p.contactName}</span> },
    { key: "commissionRate", header: "Commission", render: (p) => <span className="text-gray-400">{p.commissionRate}%</span> },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "actions", header: "", render: (p) => p.status === "active" ? (
        <button onClick={() => handleSuspend(p.id)} disabled={suspendingId === p.id}
          className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors disabled:opacity-50" title="Suspend">
          {suspendingId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
        </button>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Partners" description="Platform partner management" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Partner
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No partners found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Partner</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                  <select value={partnerType} onChange={(e) => setPartnerType(e.target.value as PlatformPartner["partnerType"])}
                    className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                    <option value="technology">Technology</option>
                    <option value="implementation">Implementation</option>
                    <option value="training">Training</option>
                    <option value="financial">Financial</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact Name</label>
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact Email</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Commission Rate (%)</label>
                <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} min="0" max="100" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
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
