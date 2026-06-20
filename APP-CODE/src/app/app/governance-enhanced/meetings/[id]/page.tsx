"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { MEETING_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { CommitteeMeeting } from "@/types"

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [meeting, setMeeting] = useState<CommitteeMeeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [minutes, setMinutes] = useState("")
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const data = await svc.getMeeting(id)
        if (!cancelled) {
          setMeeting(data)
          if (data?.minutes) setMinutes(data.minutes)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load meeting")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleComplete = async () => {
    if (!minutes) return
    setCompleting(true)
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.completeMeeting(id, minutes)
      const data = await svc.getMeeting(id)
      setMeeting(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to complete meeting")
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>

  if (error || !meeting) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Meeting not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Meetings
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={meeting.title} description={meeting.committeeName} />
        {meeting.status === "scheduled" && (
          <button onClick={handleComplete} disabled={completing || !minutes}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600/80 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:opacity-50 transition-colors">
            {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {completing ? "Completing..." : "Complete Meeting"}
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Meeting Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Committee</p>
                <p className="text-sm text-white mt-1">{meeting.committeeName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={meeting.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm text-white mt-1">{new Date(meeting.meetingDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm text-white mt-1">{meeting.startTime}{meeting.endTime ? ` - ${meeting.endTime}` : ""}</p>
              </div>
              {meeting.location && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-white mt-1">{meeting.location}</p>
                </div>
              )}
              {meeting.virtualLink && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Virtual Link</p>
                  <a href={meeting.virtualLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[#3CA4F9] hover:underline mt-1 block">Join Online</a>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Agenda</p>
              <p className="text-sm text-white mt-1 whitespace-pre-wrap">{meeting.agenda}</p>
            </div>
          </div>

          {meeting.status === "scheduled" ? (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Minutes</h3>
              <textarea value={minutes} onChange={(e) => setMinutes(e.target.value)}
                placeholder="Enter meeting minutes..."
                rows={8}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
            </div>
          ) : meeting.minutes ? (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Minutes</h3>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-sm text-white whitespace-pre-wrap">{meeting.minutes}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Attendees ({meeting.attendees.length})</h3>
            {meeting.attendees.length > 0 ? (
              <div className="space-y-2">
                {meeting.attendees.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                    <span className="text-sm text-white">{a.memberName}</span>
                    <span className={a.attended ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                      {a.attended ? "Present" : "Absent"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No attendees recorded.</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Resolutions ({meeting.resolutions.length})</h3>
            {meeting.resolutions.length > 0 ? (
              <div className="space-y-2">
                {meeting.resolutions.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                    <p className="text-sm text-white">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={r.status} />
                      <span className="text-xs text-gray-500">Votes: {r.voteCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No resolutions proposed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
