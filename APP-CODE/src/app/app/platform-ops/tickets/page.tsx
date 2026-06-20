"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, CheckCircle, MessageSquare } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getPlatformOpsService } from "@/lib/services"
import type { SupportTicket } from "@/types"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<SupportTicket["priority"]>("medium")
  const [category, setCategory] = useState<SupportTicket["category"]>("technical")
  const [saving, setSaving] = useState(false)
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getPlatformOpsService()
        const data = await svc.listTickets()
        if (!cancelled) setTickets(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleResolve = async (id: string) => {
    setResolvingId(id)
    try {
      const svc = await getPlatformOpsService()
      await svc.resolveTicket(id)
      setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: "resolved" as const, resolvedAt: new Date().toISOString() } : t))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to resolve")
    } finally {
      setResolvingId(null)
    }
  }

  const handleAdd = async () => {
    if (!subject) return
    setSaving(true)
    try {
      const svc = await getPlatformOpsService()
      await svc.createTicket({
        tenantId: "tenant-1", subject, description, priority, category,
        status: "open", createdBy: "admin-1", createdByName: "Admin", messages: [],
      })
      const data = await svc.listTickets()
      setTickets(data)
      setShowForm(false); setSubject(""); setDescription("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<SupportTicket>[] = [
    { key: "subject", header: "Subject", render: (t) => <span className="text-white">{t.subject}</span> },
    { key: "priority", header: "Priority", render: (t) => (
      <span className={`text-xs capitalize ${t.priority === "critical" ? "text-red-400" : t.priority === "high" ? "text-orange-400" : t.priority === "medium" ? "text-yellow-400" : "text-green-400"}`}>{t.priority}</span>
    )},
    { key: "category", header: "Category", render: (t) => <span className="text-gray-400 capitalize">{t.category.replace(/_/g, " ")}</span> },
    { key: "assignedTo", header: "Assigned", render: (t) => <span className="text-gray-400">{t.assignedTo || "-"}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status.replace(/_/g, "-")} /> },
    {
      key: "actions", header: "", render: (t) => t.status !== "resolved" && t.status !== "closed" ? (
        <button onClick={() => handleResolve(t.id)} disabled={resolvingId === t.id}
          className="p-1.5 rounded-md bg-green-600/40 text-green-400 hover:bg-green-500/60 transition-colors disabled:opacity-50" title="Resolve">
          {resolvingId === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
        </button>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Support Tickets" description="Tenant support requests" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Ticket
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No tickets found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Support Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as SupportTicket["priority"])}
                    className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as SupportTicket["category"])}
                    className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !subject}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
