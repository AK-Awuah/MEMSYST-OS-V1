"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Power, PowerOff } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAIService } from "@/lib/services"
import type { AIAssistant } from "@/types"

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState<AIAssistant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [assistantType, setAssistantType] = useState<AIAssistant["assistantType"]>("general")
  const [description, setDescription] = useState("")
  const [model, setModel] = useState("gpt-4")
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAIService()
        const data = await svc.listAssistants("tenant-1")
        if (!cancelled) setAssistants(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleToggle = async (id: string, enabled: boolean) => {
    setTogglingId(id)
    try {
      const svc = await getAIService()
      await svc.toggleAssistant(id, !enabled)
      setAssistants((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !enabled } : a))
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
      const svc = await getAIService()
      await svc.createAssistant("tenant-1", {
        tenantId: "tenant-1", name, assistantType, description, model, temperature: 0.7, maxTokens: 2048,
        enabled: true, trainingData: [], useTenantContext: true, suggestedQuestions: [], createdBy: "admin-1", systemPrompt: "",
      })
      const data = await svc.listAssistants("tenant-1")
      setAssistants(data)
      setShowForm(false); setName(""); setDescription("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  const filtered = assistants.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<AIAssistant>[] = [
    { key: "name", header: "Name", render: (a) => <span className="text-white">{a.name}</span> },
    { key: "assistantType", header: "Type", render: (a) => <span className="text-gray-400 capitalize">{a.assistantType.replace(/_/g, " ")}</span> },
    { key: "model", header: "Model", render: (a) => <span className="text-gray-400 font-mono text-xs">{a.model}</span> },
    { key: "enabled", header: "Status", render: (a) => <StatusBadge status={a.enabled ? "active" : "inactive"} /> },
    {
      key: "actions", header: "", render: (a) => (
        <button onClick={() => handleToggle(a.id, a.enabled)} disabled={togglingId === a.id}
          className="p-1.5 rounded-md bg-[#012a42] text-gray-400 hover:text-white transition-colors disabled:opacity-50" title={a.enabled ? "Disable" : "Enable"}>
          {togglingId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : a.enabled ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="AI Assistants" description="Manage AI assistants" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Assistant
        </button>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search assistants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No assistants found." />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Assistant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Assistant name" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                <select value={assistantType} onChange={(e) => setAssistantType(e.target.value as AIAssistant["assistantType"])}
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                  <option value="general">General</option>
                  <option value="membership">Membership</option>
                  <option value="finance">Finance</option>
                  <option value="communication">Communication</option>
                  <option value="governance">Governance</option>
                  <option value="training">Training</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the assistant's purpose"
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
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
