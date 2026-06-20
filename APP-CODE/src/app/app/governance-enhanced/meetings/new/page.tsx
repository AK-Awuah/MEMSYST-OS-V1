"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Committee } from "@/types"

export default function NewMeetingPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [agenda, setAgenda] = useState("")
  const [committeeId, setCommitteeId] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [location, setLocation] = useState("")
  const [virtualLink, setVirtualLink] = useState("")
  const [committees, setCommittees] = useState<Committee[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const svc = await getGovernanceEnhancedService()
        const data = await svc.listCommittees("tenant-1")
        setCommittees(data)
      } catch { /* ignore */ }
    }
    fetch()
  }, [])

  const handleSubmit = async () => {
    if (!title || !committeeId || !meetingDate || !startTime) return
    setSubmitting(true)
    try {
      const svc = await getGovernanceEnhancedService()
      const committee = committees.find((c) => c.id === committeeId)
      await svc.createMeeting({
        committeeId,
        committeeName: committee?.name || "Unknown",
        tenantId: "tenant-1",
        title,
        agenda,
        meetingDate: new Date(meetingDate).toISOString(),
        startTime,
        location: location || undefined,
        virtualLink: virtualLink || undefined,
        status: "scheduled",
        attendees: [],
        resolutions: [],
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/governance-enhanced/meetings"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to schedule meeting")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Save className="h-8 w-8 text-green-400" />
        </div>
        <p className="text-lg font-medium text-white">Meeting scheduled successfully!</p>
        <p className="text-sm text-gray-400">Redirecting to meetings list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Meetings
      </button>
      <PageHeader title="Schedule Meeting" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting title" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Committee</label>
          <select value={committeeId} onChange={(e) => setCommitteeId(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
            <option value="">Select committee...</option>
            {committees.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
            <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Virtual Link</label>
            <input type="url" value={virtualLink} onChange={(e) => setVirtualLink(e.target.value)} placeholder="https://meet.example.com" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Agenda</label>
          <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="Meeting agenda items..." rows={4}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || !title || !committeeId || !meetingDate || !startTime}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </div>
    </div>
  )
}
