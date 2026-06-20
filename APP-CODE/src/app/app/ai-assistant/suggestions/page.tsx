"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, CheckCircle, XCircle } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAIService } from "@/lib/services"
import type { WorkflowSuggestion } from "@/types"

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAIService()
        const data = await svc.listSuggestions("tenant-1")
        if (!cancelled) setSuggestions(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleApprove = async (id: string) => {
    setActionId(id)
    try {
      const svc = await getAIService()
      await svc.approveSuggestion(id, "admin-1")
      setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "approved" as const, reviewedBy: "admin-1" } : s))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to approve")
    } finally {
      setActionId(null)
    }
  }

  const handleDismiss = async (id: string) => {
    setActionId(id)
    try {
      const svc = await getAIService()
      await svc.dismissSuggestion(id, "admin-1")
      setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "dismissed" as const, reviewedBy: "admin-1" } : s))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to dismiss")
    } finally {
      setActionId(null)
    }
  }

  const filtered = suggestions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<WorkflowSuggestion>[] = [
    { key: "title", header: "Title", render: (s) => <span className="text-white">{s.title}</span> },
    { key: "triggerEvent", header: "Trigger", render: (s) => <span className="text-gray-400">{s.triggerEvent}</span> },
    { key: "confidence", header: "Confidence", render: (s) => <span className="text-gray-400">{Math.round(s.confidence * 100)}%</span> },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status.replace(/_/g, "-")} /> },
    {
      key: "actions", header: "", render: (s) =>
        s.status === "pending_review" ? (
          <div className="flex gap-1.5">
            <button onClick={() => handleApprove(s.id)} disabled={actionId === s.id}
              className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors disabled:opacity-50" title="Approve">
              {actionId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => handleDismiss(s.id)} disabled={actionId === s.id}
              className="p-1.5 rounded-md bg-red-600/40 text-red-400 hover:bg-red-500/60 transition-colors disabled:opacity-50" title="Dismiss">
              {actionId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
            </button>
          </div>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Suggestions" description="Workflow automation suggestions" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search suggestions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No suggestions found." />
        </div>
      )}
    </div>
  )
}
