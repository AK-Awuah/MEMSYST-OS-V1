"use client"

import { useState, useEffect } from "react"
import { BarChart3, Vote, Users, UsersRound, BookCheck, CalendarDays, Loader2 } from "lucide-react"
import { PageHeader, StatCard } from "@/components/admin"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { GovernanceDashboardMetrics } from "@/types"

export default function GovernanceAnalyticsPage() {
  const [metrics, setMetrics] = useState<GovernanceDashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const data = await svc.getDashboardMetrics("tenant-1")
        if (!cancelled) setMetrics(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load analytics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (error) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
  if (!metrics) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Governance Analytics" description="Track governance performance and engagement" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Elections" value={metrics.totalElections} icon={<Vote className="h-5 w-5" />} />
        <StatCard title="Active Elections" value={metrics.activeElections} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Total Candidates" value={metrics.totalCandidates} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Votes Cast" value={metrics.totalVotesCast} icon={<BarChart3 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Committees" value={metrics.totalCommittees} icon={<UsersRound className="h-5 w-5" />} />
        <StatCard title="Active Committees" value={metrics.activeCommittees} icon={<UsersRound className="h-5 w-5" />} />
        <StatCard title="Total Meetings" value={metrics.totalMeetings} icon={<CalendarDays className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Upcoming Meetings" value={metrics.upcomingMeetings} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard title="Total Resolutions" value={metrics.totalResolutions} icon={<BookCheck className="h-5 w-5" />} />
        <StatCard title="Passed Resolutions" value={metrics.passedResolutions} icon={<BookCheck className="h-5 w-5" />} />
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-2">Voter Turnout Rate</h3>
        <div className="flex items-center gap-4">
          <div className="h-4 flex-1 rounded-full bg-[#012a42] overflow-hidden">
            <div className="h-full rounded-full bg-[#3CA4F9] transition-all" style={{ width: `${metrics.voterTurnoutRate * 100}%` }} />
          </div>
          <span className="text-2xl font-bold text-white">{(metrics.voterTurnoutRate * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
