"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Power, PowerOff } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getTieringService } from "@/lib/services"
import type { VisibilityRule } from "@/types"

export default function RulesPage() {
  const [rules, setRules] = useState<VisibilityRule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [entityType, setEntityType] = useState<VisibilityRule["entityType"]>("member")
  const [priority, setPriority] = useState("0")
  const [boostFactor, setBoostFactor] = useState("1.0")
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTieringService()
        const data = await svc.listRules("tenant-1")
        if (!cancelled) setRules(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleToggle = async (id: string, isActive: boolean) => {
    setTogglingId(id)
    try {
      const svc = await getTieringService()
      await svc.toggleRule(id, !isActive)
      setRules((prev) => prev.map((r) => r.id === id ? { ...r, isActive: !isActive } : r))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to toggle")
    } finally {
      setTogglingId(null)
    }
  }

  const handleAdd = async () => {
    if (!name) return
    setSaving(true)
    try {
      const svc = await getTieringService()
      await svc.createRule("tenant-1", {
        tenantId: "tenant-1", name, description, entityType,
        criteria: {}, priority: parseInt(priority, 10),
        boostFactor: parseFloat(boostFactor), isActive: true,
      })
      const data = await svc.listRules("tenant-1")
      setRules(data)
      setShowForm(false); setName(""); setDescription("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  const filtered = rules.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<VisibilityRule>[] = [
    { key: "name", header: "Name", render: (r) => <span className="text-white">{r.name}</span> },
    { key: "entityType", header: "Entity Type", render: (r) => <span className="text-gray-400 capitalize">{r.entityType.replace(/_/g, " ")}</span> },
    { key: "priority", header: "Priority", render: (r) => <span className="text-gray-400">{r.priority}</span> },
    { key: "boostFactor", header: "Boost", render: (r) => <span className="text-gray-400">{r.boostFactor}x</span> },
    { key: "isActive", header: "Active", render: (r) => <StatusBadge status={r.isActive ? "active" : "inactive"} /> },
    {
      key: "actions", header: "", render: (r) => (
        <button onClick={() => handleToggle(r.id, r.isActive)} disabled={togglingId === r.id}
          className="p-1.5 rounded-md bg-[#012a42] text-gray-400 hover:text-white transition-colors disabled:opacity-50" title={r.isActive ? "Disable" : "Enable"}>
          {togglingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : r.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Visibility Rules" description="Search visibility rules" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Rule
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search rules..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No visibility rules found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Visibility Rule</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Entity Type</label>
                  <select value={entityType} onChange={(e) => setEntityType(e.target.value as VisibilityRule["entityType"])}
                    className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                    <option value="member">Member</option>
                    <option value="listing">Listing</option>
                    <option value="business">Business</option>
                    <option value="training_center">Training Center</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
                  <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Boost Factor</label>
                  <input type="number" value={boostFactor} onChange={(e) => setBoostFactor(e.target.value)} min="1" step="0.5" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
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
