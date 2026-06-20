"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { getAnalyticsService } from "@/lib/services"
import type { CustomDashboard, DashboardWidget } from "@/types"

export default function DashboardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [dashboard, setDashboard] = useState<CustomDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddWidget, setShowAddWidget] = useState(false)
  const [widgetTitle, setWidgetTitle] = useState("")
  const [widgetType, setWidgetType] = useState<DashboardWidget["widgetType"]>("stat")
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAnalyticsService()
        const data = await svc.getDashboard(id)
        if (!cancelled) setDashboard(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleAddWidget = async () => {
    if (!widgetTitle || !dataSource) return
    try {
      const svc = await getAnalyticsService()
      await svc.addWidget(id, {
        tenantId: "tenant-1",
        title: widgetTitle,
        widgetType,
        dataSource,
        position: dashboard!.widgets.length,
        width: 1,
        height: 1,
        config: {},
      })
      const data = await svc.getDashboard(id)
      setDashboard(data)
      setShowAddWidget(false)
      setWidgetTitle("")
      setDataSource("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to add widget")
    }
  }

  const handleRemoveWidget = async (widgetId: string) => {
    try {
      const svc = await getAnalyticsService()
      await svc.removeWidget(id, widgetId)
      setDashboard((prev) => prev ? { ...prev, widgets: prev.widgets.filter((w) => w.id !== widgetId) } : prev)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to remove widget")
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Dashboard not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboards
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={dashboard.name} description={dashboard.description} />
        <button onClick={() => setShowAddWidget(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Widget
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {dashboard.widgets.map((widget) => (
          <div key={widget.id} className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">{widget.title}</h3>
              <button onClick={() => handleRemoveWidget(widget.id)}
                className="p-1 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-300 capitalize">{widget.widgetType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Source</span>
                <span className="text-gray-300">{widget.dataSource}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Size</span>
                <span className="text-gray-300">{widget.width}x{widget.height}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dashboard.widgets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#1e3a5f] bg-[#011B2B]/30 p-12 text-center">
          <p className="text-sm text-gray-500">No widgets yet. Click "Add Widget" to get started.</p>
        </div>
      )}

      {showAddWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Widget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                <input type="text" value={widgetTitle} onChange={(e) => setWidgetTitle(e.target.value)} placeholder="Widget title"
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                <select value={widgetType} onChange={(e) => setWidgetType(e.target.value as DashboardWidget["widgetType"])}
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                  <option value="stat">Stat</option>
                  <option value="chart">Chart</option>
                  <option value="table">Table</option>
                  <option value="list">List</option>
                  <option value="metric">Metric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Data Source</label>
                <input type="text" value={dataSource} onChange={(e) => setDataSource(e.target.value)} placeholder="e.g., members, revenue"
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowAddWidget(false)}
                className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAddWidget} disabled={!widgetTitle || !dataSource}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
