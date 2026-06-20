"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Loader2 } from "lucide-react"
import { PageHeader, StatCard } from "@/components/admin"
import { getEventsService } from "@/lib/services"
import type { EventsAnalytics } from "@/types"

export default function EventsAnalyticsPage() {
  const [analytics, setAnalytics] = useState<EventsAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getEventsService()
        const data = await svc.getAnalytics("tenant-1")
        if (!cancelled) setAnalytics(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load analytics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Events Analytics" description="Track event performance and engagement" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={analytics.totalEvents} icon={<Calendar className="h-5 w-5" />} />
        <StatCard title="Upcoming Events" value={analytics.upcomingEvents} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Completed" value={analytics.completedEvents} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Total Registrations" value={analytics.totalRegistrations} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Attendance" value={analytics.totalAttendance} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Attendance Rate" value={`${(analytics.attendanceRate * 100).toFixed(1)}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Total Revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">Events by Type</h3>
          {analytics.byType.length > 0 ? (
            <div className="space-y-3">
              {analytics.byType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{item.type.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-[#012a42] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#3CA4F9] transition-all"
                        style={{ width: `${analytics.totalEvents > 0 ? (item.count / analytics.totalEvents) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">Events by Status</h3>
          {analytics.byStatus.length > 0 ? (
            <div className="space-y-3">
              {analytics.byStatus.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{item.status.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-[#012a42] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${analytics.totalEvents > 0 ? (item.count / analytics.totalEvents) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Upcoming Events</h3>
        {analytics.upcomingEventsList.length > 0 ? (
          <div className="space-y-2">
            {analytics.upcomingEventsList.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <div>
                  <p className="text-sm text-white font-medium">{ev.title}</p>
                  <p className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm text-[#3CA4F9]">{ev.registrations} registrations</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming events.</p>
        )}
      </div>
    </div>
  )
}
