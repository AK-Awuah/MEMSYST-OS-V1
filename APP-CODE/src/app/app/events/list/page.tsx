"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { EVENT_STATUS_LABELS, EVENT_TYPE_LABELS, EVENT_FORMAT_LABELS } from "@/lib/constants"
import { getEventsService } from "@/lib/services"
import type { Event, EventsAnalytics } from "@/types"

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [analytics, setAnalytics] = useState<EventsAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getEventsService()
        const [eventsData, analyticsData] = await Promise.all([
          svc.listEvents("tenant-1"),
          svc.getAnalytics("tenant-1"),
        ])
        if (!cancelled) {
          setEvents(eventsData)
          setAnalytics(analyticsData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load events")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: Column<Event>[] = [
    { key: "title", header: "Title", render: (e) => (
      <Link href={`/app/events/${e.id}`} className="text-[#3CA4F9] hover:underline font-medium">
        {e.title}
      </Link>
    )},
    { key: "eventType", header: "Type", render: (e) => <span className="text-gray-400">{EVENT_TYPE_LABELS[e.eventType]}</span> },
    { key: "format", header: "Format", render: (e) => <span className="text-gray-400">{EVENT_FORMAT_LABELS[e.format]}</span> },
    { key: "startDate", header: "Date", render: (e) => <span className="text-gray-400">{new Date(e.startDate).toLocaleDateString()}</span> },
    { key: "registeredCount", header: "Registered", render: (e) => <span className="text-white">{e.registeredCount}/{e.maxAttendees}</span> },
    { key: "status", header: "Status", render: (e) => <StatusBadge status={e.status} /> },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Events" description="Manage organization events and workshops" />
        <Link
          href="/app/events/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Event
        </Link>
      </div>

      {analytics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Events" value={analytics.totalEvents} />
          <StatCard title="Upcoming" value={analytics.upcomingEvents} />
          <StatCard title="Completed" value={analytics.completedEvents} />
          <StatCard title="Total Revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} />
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {Object.entries(EVENT_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No events found."
        />
      </div>
    </div>
  )
}
