"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAdvertisingService } from "@/lib/services"
import type { SponsorDeal } from "@/types"

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<SponsorDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorContact, setSponsorContact] = useState("")
  const [sponsorshipTier, setSponsorshipTier] = useState("gold")
  const [amount, setAmount] = useState("0")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAdvertisingService()
        const data = await svc.listSponsors("tenant-1")
        if (!cancelled) setSponsors(data)
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
    if (!sponsorName) return
    setSaving(true)
    try {
      const svc = await getAdvertisingService()
      await svc.createSponsor("tenant-1", {
        tenantId: "tenant-1", sponsorName, sponsorContact,
        sponsorshipTier, amount: parseFloat(amount), currency: "USD",
        benefits: [], startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 86400000).toISOString(), status: "active",
      })
      const data = await svc.listSponsors("tenant-1")
      setSponsors(data)
      setShowForm(false); setSponsorName(""); setSponsorContact("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed")
    } finally {
      setSaving(false)
    }
  }

  const filtered = sponsors.filter((s) =>
    s.sponsorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<SponsorDeal>[] = [
    { key: "sponsorName", header: "Sponsor", render: (s) => <span className="text-white">{s.sponsorName}</span> },
    { key: "sponsorshipTier", header: "Tier", render: (s) => <span className="text-gray-400 capitalize">{s.sponsorshipTier}</span> },
    { key: "amount", header: "Amount", render: (s) => <span className="text-gray-400">${s.amount.toLocaleString()}</span> },
    { key: "startDate", header: "Start", render: (s) => <span className="text-gray-400 text-xs">{new Date(s.startDate).toLocaleDateString()}</span> },
    { key: "endDate", header: "End", render: (s) => <span className="text-gray-400 text-xs">{new Date(s.endDate).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Sponsors" description="Sponsorship deal management" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Sponsor
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search sponsors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No sponsors found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Sponsor Deal</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Sponsor Name</label>
                  <input type="text" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tier</label>
                  <input type="text" value={sponsorshipTier} onChange={(e) => setSponsorshipTier(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact</label>
                  <input type="text" value={sponsorContact} onChange={(e) => setSponsorContact(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount ($)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !sponsorName}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
