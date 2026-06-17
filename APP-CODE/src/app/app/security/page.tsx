"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { getSecurityAuditService } from "@/lib/services"
import type { SecurityDashboardMetrics, SecurityEvent } from "@/types"
import { Shield, Users, AlertTriangle, Lock, Eye, LogIn, UserCog, X } from "lucide-react"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const actionIcons: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4 text-green-400" />,
  logout: <LogIn className="h-4 w-4 text-gray-500 rotate-180" />,
  failed_login: <AlertTriangle className="h-4 w-4 text-red-400" />,
  role_changed: <UserCog className="h-4 w-4 text-yellow-400" />,
  password_changed: <Lock className="h-4 w-4 text-blue-400" />,
  session_terminated: <X className="h-4 w-4 text-orange-400" />,
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    login: "bg-green-500/10 text-green-400",
    logout: "bg-gray-500/10 text-gray-400",
    failed_login: "bg-red-500/10 text-red-400",
    role_changed: "bg-yellow-500/10 text-yellow-400",
    password_changed: "bg-blue-500/10 text-blue-400",
    session_terminated: "bg-orange-500/10 text-orange-400",
  }
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${colors[action] || "bg-gray-500/10 text-gray-400"}`}>
      {action.replace(/_/g, " ")}
    </span>
  )
}

export default function SecurityDashboardPage() {
  const [metrics, setMetrics] = useState<SecurityDashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"all" | "logins" | "failed" | "changes">("all")

  async function loadMetrics() {
    const svc = await getSecurityAuditService()
    const data = await svc.getDashboardMetrics("memsyst")
    setMetrics(data)
    setLoading(false)
  }

  useEffect(() => { loadMetrics() }, [])

  if (loading || !metrics) {
    return (
      <div>
        <PageHeader title="Security Dashboard" description="Monitor security events and system access" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
        </div>
      </div>
    )
  }

  let displayedEvents: SecurityEvent[] = []
  switch (selectedTab) {
    case "all": displayedEvents = metrics.recentEvents; break
    case "logins": displayedEvents = metrics.recentLogins; break
    case "failed": displayedEvents = []; break
    case "changes": displayedEvents = metrics.recentRoleChanges; break
  }

  return (
    <div>
      <PageHeader title="Security Dashboard" description="Monitor security events and system access" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Users</p>
            <Users className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.totalUsers}</p>
          <p className="text-xs text-gray-500">{metrics.activeUsers} active</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Failed Logins (24h)</p>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <p className={`mt-1 text-2xl font-bold ${metrics.failedLogins24h > 0 ? "text-red-400" : "text-green-400"}`}>{metrics.failedLogins24h}</p>
          <p className="text-xs text-gray-500">attempts in last 24h</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Locked Accounts</p>
            <Lock className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.lockedAccounts}</p>
          <p className="text-xs text-gray-500">temporarily locked</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Active Sessions</p>
            <Eye className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.activeSessions}</p>
          <p className="text-xs text-gray-500">currently active</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42]">
        <div className="border-b border-[#1e3a5f]">
          <div className="flex">
            {(["all", "logins", "failed", "changes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "all" && "Recent Events"}
                {tab === "logins" && "Recent Logins"}
                {tab === "failed" && "Failed Logins"}
                {tab === "changes" && "Role Changes"}
              </button>
            ))}
          </div>
        </div>

        <div>
          {displayedEvents.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              <Shield className="mx-auto mb-2 h-8 w-8 text-gray-600" />
              No events to display
            </div>
          ) : (
            <div className="divide-y divide-[#1e3a5f]">
              {displayedEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-4 hover:bg-[#011B2B]/30">
                  <div className="mt-0.5 flex-shrink-0">
                    {actionIcons[event.action] || <Shield className="h-4 w-4 text-gray-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{event.actorName}</span>
                      <ActionBadge action={event.action} />
                      <span className="text-xs text-gray-500">{timeAgo(event.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {event.details || `${event.action.replace(/_/g, " ")} on ${event.resource}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {event.ipAddress} &middot; {event.device}
                    </p>
                  </div>
                  <span className={`mt-1 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    event.result === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {event.result}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
