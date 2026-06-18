"use client"

import type { Tenant, TenantAuditLog } from "@/types"
import { useState, useEffect } from "react"
import { getTenantAuditService } from "@/lib/services"
import { Loader2, Search } from "lucide-react"

export function AuditTab({ tenant }: { tenant: Tenant }) {
  const [events, setEvents] = useState<TenantAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [moduleFilter, setModuleFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("")

  useEffect(() => {
    loadData()
  }, [tenant.id])

  async function loadData() {
    const svc = await getTenantAuditService()
    const e = await svc.listEvents(tenant.id)
    setEvents(e)
    setLoading(false)
  }

  const filtered = moduleFilter || actionFilter
    ? events.filter((e) => {
        if (moduleFilter && e.module !== moduleFilter) return false
        if (actionFilter && e.action !== actionFilter) return false
        return true
      })
    : events

  const modules = [...new Set(events.map((e) => e.module))]
  const actions = [...new Set(events.map((e) => e.action))]

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Tenant Audit Log</h3>

        <div className="mb-4 flex flex-wrap gap-3">
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300">
            <option value="">All Modules</option>
            {modules.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300">
            <option value="">All Actions</option>
            {actions.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
          </select>
          <span className="text-sm text-gray-500 self-center">{filtered.length} events</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No audit events found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((event) => (
              <div key={event.id} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ActionBadge action={event.action} />
                    <span className="text-sm text-white">{event.actor}</span>
                    <span className="text-xs text-gray-500">—</span>
                    <span className="text-xs text-gray-400 capitalize">{event.module}</span>
                  </div>
                  <span className="text-xs text-gray-600">{new Date(event.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {event.newValue && <p className="text-gray-400">{event.newValue}</p>}
                  {event.previousValue && <p className="text-gray-600">Previous: {event.previousValue}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    tenant_created: "bg-green-500/10 text-green-400",
    tenant_updated: "bg-blue-500/10 text-blue-400",
    tenant_activated: "bg-green-500/10 text-green-400",
    tenant_suspended: "bg-yellow-500/10 text-yellow-400",
    tenant_archived: "bg-red-500/10 text-red-400",
    region_created: "bg-purple-500/10 text-purple-400",
    branch_created: "bg-indigo-500/10 text-indigo-400",
    position_created: "bg-cyan-500/10 text-cyan-400",
    executive_appointed: "bg-pink-500/10 text-pink-400",
    config_changed: "bg-orange-500/10 text-orange-400",
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${colors[action] || "bg-gray-500/10 text-gray-400"}`}>
      {action.replace(/_/g, " ")}
    </span>
  )
}
