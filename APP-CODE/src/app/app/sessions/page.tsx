"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { getSessionService, getAuthService } from "@/lib/services"
import type { Session, MemsystUser } from "@/types"
import { LogOut, Monitor, Smartphone, Globe } from "lucide-react"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [users, setUsers] = useState<MemsystUser[]>([])
  const [loading, setLoading] = useState(true)
  const [terminating, setTerminating] = useState<string | null>(null)

  async function loadData() {
    const [sessionSvc, authSvc] = await Promise.all([getSessionService(), getAuthService()])
    const [sessionData, userData] = await Promise.all([
      sessionSvc.listAllActiveSessions("memsyst"),
      authSvc.listUsers(),
    ])
    setSessions(sessionData)
    setUsers(userData)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function getUserName(userId: string) {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : userId
  }

  function getUserEmail(userId: string) {
    const user = users.find((u) => u.id === userId)
    return user?.email || ""
  }

  function getDeviceIcon(device: string) {
    if (/mobile|android|iphone|ipad/i.test(device)) return <Smartphone className="h-4 w-4 text-[#3CA4F9]" />
    return <Monitor className="h-4 w-4 text-[#3CA4F9]" />
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  async function handleTerminate(sessionId: string) {
    setTerminating(sessionId)
    const svc = await getSessionService()
    await svc.terminateSession(sessionId)
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    setTerminating(null)
  }

  function isExpiringSoon(expiresAt: string) {
    return new Date(expiresAt).getTime() - Date.now() < 1800000
  }

  const columns: Column<Session>[] = [
    {
      key: "user",
      header: "User",
      render: (s) => (
        <div>
          <span className="font-medium text-white">{getUserName(s.userId)}</span>
          <span className="block text-xs text-gray-500">{getUserEmail(s.userId)}</span>
        </div>
      ),
    },
    {
      key: "device",
      header: "Device",
      render: (s) => (
        <div className="flex items-center gap-2">
          {getDeviceIcon(s.device)}
          <span className="text-sm text-gray-300">{s.device}</span>
        </div>
      ),
    },
    {
      key: "ipAddress",
      header: "IP Address",
      render: (s) => (
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-sm text-gray-400">{s.ipAddress}</span>
        </div>
      ),
    },
    {
      key: "lastActiveAt",
      header: "Last Active",
      render: (s) => <span className="text-sm text-gray-400">{timeAgo(s.lastActiveAt)}</span>,
    },
    {
      key: "expiresAt",
      header: "Expires",
      render: (s) => (
        <span className={`text-sm ${isExpiringSoon(s.expiresAt) ? "text-yellow-400" : "text-gray-400"}`}>
          {timeAgo(s.expiresAt)}
        </span>
      ),
    },
    {
      key: "actions", header: "", render: (s) => (
        <button
          onClick={() => handleTerminate(s.id)}
          disabled={terminating === s.id}
          className="flex items-center gap-1 rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
        >
          <LogOut className="h-3 w-3" />
          {terminating === s.id ? "Terminating..." : "Terminate"}
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Session Management"
        description="View and manage active user sessions across the platform"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active Sessions</p>
          <p className="mt-1 text-2xl font-bold text-white">{sessions.length}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Unique Users</p>
          <p className="mt-1 text-2xl font-bold text-white">{new Set(sessions.map((s) => s.userId)).size}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Expiring Soon</p>
          <p className="mt-1 text-2xl font-bold text-yellow-400">{sessions.filter((s) => isExpiringSoon(s.expiresAt)).length}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg. Session Age</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {sessions.length > 0
              ? timeAgo(new Date(sessions.reduce((sum, s) => sum + new Date(s.createdAt).getTime(), 0) / sessions.length).toISOString())
              : "N/A"}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        isLoading={loading}
        emptyMessage="No active sessions found."
      />
    </div>
  )
}
