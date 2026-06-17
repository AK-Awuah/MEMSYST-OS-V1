"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { getAuditService } from "@/lib/services"
import type { AuditLog } from "@/types"
import { Shield } from "lucide-react"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ module: "", action: "" })

  useEffect(() => {
    getAuditService().then((svc) => {
      svc.listLogs({ limit: 50 }).then((data) => {
        setLogs(data)
        setLoading(false)
      })
    })
  }, [])

  const columns: Column<AuditLog>[] = [
    { key: "actor", header: "Actor", render: (l) => <span className="font-medium text-white">{l.actor}</span> },
    { key: "action", header: "Action", render: (l) => <span className="capitalize text-gray-400">{l.action.replace(/_/g, " ")}</span> },
    { key: "module", header: "Module", render: (l) => <span className="capitalize text-gray-400">{l.module}</span> },
    { key: "recordType", header: "Record", render: (l) => <span className="text-gray-400">{l.recordType}</span> },
    { key: "newValue", header: "Details", render: (l) => (
      <div className="min-w-0 max-w-xs">
        <p className="truncate text-xs text-gray-400">{l.newValue || "-"}</p>
        {l.previousValue && <p className="truncate text-xs text-gray-600">Was: {l.previousValue}</p>}
      </div>
    )},
    { key: "createdAt", header: "Date", render: (l) => (
      <div className="text-right">
        <p className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</p>
        <p className="text-xs text-gray-600">{new Date(l.createdAt).toLocaleTimeString()}</p>
      </div>
    ), className: "text-right" },
  ]

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Immutable record of all platform actions"
      />

      <div className="mb-4 flex gap-3">
        <select
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-400"
          value={filter.module}
          onChange={(e) => setFilter({ ...filter, module: e.target.value })}
        >
          <option value="">All Modules</option>
          <option value="leads">Leads</option>
          <option value="forms">Forms</option>
          <option value="tenants">Tenants</option>
          <option value="users">Users</option>
          <option value="crm">CRM</option>
        </select>
        <select
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-400"
          value={filter.action}
          onChange={(e) => setFilter({ ...filter, action: e.target.value })}
        >
          <option value="">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="assign">Assign</option>
          <option value="update_status">Status Change</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={logs.filter((l) => {
          if (filter.module && l.module !== filter.module) return false
          if (filter.action && l.action !== filter.action) return false
          return true
        })}
        isLoading={loading}
        emptyMessage="No audit logs recorded."
      />
    </div>
  )
}
