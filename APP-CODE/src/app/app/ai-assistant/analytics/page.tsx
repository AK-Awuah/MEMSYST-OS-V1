"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Play } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAIService } from "@/lib/services"
import type { SmartAnalytic } from "@/types"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<SmartAnalytic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [dataSource, setDataSource] = useState("")
  const [query, setQuery] = useState("")
  const [schedule, setSchedule] = useState<SmartAnalytic["schedule"]>("daily")
  const [saving, setSaving] = useState(false)
  const [runningId, setRunningId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAIService()
        const data = await svc.listAnalytics("tenant-1")
        if (!cancelled) setAnalytics(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleRun = async (id: string) => {
    setRunningId(id)
    try {
      const svc = await getAIService()
      const updated = await svc.runAnalytic(id)
      setAnalytics((prev) => prev.map((a) => a.id === id ? updated : a))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to run")
    } finally {
      setRunningId(null)
    }
  }

  const handleAdd = async () => {
    if (!name) return
    setSaving(true)
    try {
      const svc = await getAIService()
      await svc.createAnalytic("tenant-1", {
        tenantId: "tenant-1", name, description, dataSource, query, schedule,
        enabled: true, recipients: [], createdBy: "admin-1",
      })
      const data = await svc.listAnalytics("tenant-1")
      setAnalytics(data)
      setShowForm(false); setName(""); setDescription(""); setDataSource(""); setQuery("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  const filtered = analytics.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<SmartAnalytic>[] = [
    { key: "name", header: "Name", render: (a) => <span className="text-white">{a.name}</span> },
    { key: "dataSource", header: "Data Source", render: (a) => <span className="text-gray-400">{a.dataSource}</span> },
    { key: "schedule", header: "Schedule", render: (a) => <span className="text-gray-400 capitalize">{a.schedule.replace(/_/g, " ")}</span> },
    { key: "enabled", header: "Status", render: (a) => <StatusBadge status={a.enabled ? "active" : "inactive"} /> },
    { key: "lastRunAt", header: "Last Run", render: (a) => <span className="text-gray-400">{a.lastRunAt ? new Date(a.lastRunAt).toLocaleDateString() : "Never"}</span> },
    {
      key: "actions", header: "", render: (a) => (
        <button onClick={() => handleRun(a.id)} disabled={runningId === a.id}
          className="p-1.5 rounded-md bg-[#012a42] text-gray-400 hover:text-white transition-colors disabled:opacity-50" title="Run now">
          {runningId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Smart Analytics" description="AI-powered analytics" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Analytic
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search analytics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No analytics found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Smart Analytic</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Analytic name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Data Source</label>
                  <input type="text" value={dataSource} onChange={(e) => setDataSource(e.target.value)} placeholder="e.g. members" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Schedule</label>
                  <select value={schedule} onChange={(e) => setSchedule(e.target.value as SmartAnalytic["schedule"])}
                    className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="on_demand">On Demand</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Query</label>
                <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={3} placeholder="Describe the analysis query..." className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
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
