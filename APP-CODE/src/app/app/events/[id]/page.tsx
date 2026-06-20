"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, XCircle, Loader2, Calendar, Users, MapPin, Globe } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { EVENT_STATUS_LABELS, EVENT_TYPE_LABELS, EVENT_FORMAT_LABELS } from "@/lib/constants"
import { getEventsService } from "@/lib/services"
import type { Event, EventRegistration } from "@/types"

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getEventsService()
        const [eventData, regData] = await Promise.all([
          svc.getEvent(id),
          svc.listRegistrations(id, "tenant-1"),
        ])
        if (!cancelled) {
          setEvent(eventData)
          setRegistrations(regData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load event")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const svc = await getEventsService()
      await svc.publishEvent(id)
      const data = await svc.getEvent(id)
      setEvent(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to publish event")
    } finally {
      setPublishing(false)
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const svc = await getEventsService()
      await svc.cancelEvent(id)
      const data = await svc.getEvent(id)
      setEvent(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to cancel event")
    } finally {
      setCancelling(false)
    }
  }

  const regColumns: Column<EventRegistration>[] = [
    { key: "memberName", header: "Member", render: (r) => <span className="text-white">{r.memberName}</span> },
    { key: "ticketType", header: "Ticket", render: (r) => <span className="text-gray-400">{r.ticketType || "-"}</span> },
    { key: "amountPaid", header: "Paid", render: (r) => <span className="text-gray-400">${r.amountPaid.toFixed(2)}</span> },
    { key: "registrationDate", header: "Registered", render: (r) => <span className="text-gray-400">{new Date(r.registrationDate).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
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
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Event not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={event.title} description={`${EVENT_TYPE_LABELS[event.eventType]} - ${EVENT_STATUS_LABELS[event.status]}`} />
        <div className="flex gap-2">
          {event.status === "draft" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50"
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {publishing ? "Publishing..." : "Publish"}
            </button>
          )}
          {(event.status === "published" || event.status === "open_for_registration") && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600/80 px-4 py-2 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              {cancelling ? "Cancelling..." : "Cancel Event"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-medium text-white mt-1">{EVENT_TYPE_LABELS[event.eventType]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Format</p>
                <p className="text-sm font-medium text-white mt-1">{EVENT_FORMAT_LABELS[event.format]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Time Zone</p>
                <p className="text-sm font-medium text-white mt-1">{event.timezone}</p>
              </div>
              {event.location && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-white mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</p>
                </div>
              )}
              {event.virtualLink && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Virtual Link</p>
                  <p className="text-sm font-medium text-white mt-1 truncate">
                    <a href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="text-[#3CA4F9] hover:underline">
                      <Globe className="h-3 w-3 inline mr-1" />Join Online
                    </a>
                  </p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Capacity</p>
                <p className="text-sm font-medium text-white mt-1"><Users className="h-3 w-3 inline mr-1" />{event.registeredCount}/{event.maxAttendees}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Fee</p>
                <p className="text-sm font-medium text-white mt-1">{event.fee > 0 ? `$${event.fee.toFixed(2)}` : "Free"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={event.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Organizer</p>
                <p className="text-sm font-medium text-white mt-1">{event.organizerName}</p>
              </div>
            </div>
            {event.description && (
              <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-white mt-1">{event.description}</p>
              </div>
            )}
            {event.speakers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Speakers</h4>
                <div className="flex flex-wrap gap-2">
                  {event.speakers.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f] text-sm text-white">{s.name}{s.title ? ` - ${s.title}` : ""}</span>
                  ))}
                </div>
              </div>
            )}
            {event.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-[#3CA4F9]/10 border border-[#3CA4F9]/30 text-xs text-[#3CA4F9]">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Registrations ({registrations.length})</h3>
            <DataTable
              columns={regColumns}
              data={registrations}
              emptyMessage="No registrations yet."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400"><Users className="h-4 w-4 inline mr-2" />Attendance</span>
                <span className="text-sm font-medium text-white">{event.attendedCount}/{event.registeredCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400"><Calendar className="h-4 w-4 inline mr-2" />Duration</span>
                <span className="text-sm font-medium text-white">
                  {Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <span className="text-sm text-gray-400">Revenue</span>
                <span className="text-sm font-medium text-white">${(event.registeredCount * event.fee).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {event.agenda.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Agenda</h3>
              <div className="space-y-2">
                {event.agenda.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#3CA4F9] font-mono">{item.time}</span>
                      {item.speaker && <span className="text-xs text-gray-500">{item.speaker}</span>}
                    </div>
                    <p className="text-sm text-white mt-1">{item.title}</p>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
