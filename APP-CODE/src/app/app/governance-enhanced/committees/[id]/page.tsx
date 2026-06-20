"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, XCircle, Loader2, CalendarDays } from "lucide-react"
import Link from "next/link"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { COMMITTEE_TYPE_LABELS, MEETING_STATUS_LABELS } from "@/lib/constants"
import { getGovernanceEnhancedService } from "@/lib/services"
import type { Committee, CommitteeMeeting } from "@/types"

export default function CommitteeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [committee, setCommittee] = useState<Committee | null>(null)
  const [meetings, setMeetings] = useState<CommitteeMeeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getGovernanceEnhancedService()
        const [committeeData, meetingsData] = await Promise.all([
          svc.getCommittee(id),
          svc.listMeetings(id),
        ])
        if (!cancelled) {
          setCommittee(committeeData)
          setMeetings(meetingsData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load committee")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleDissolve = async () => {
    try {
      const svc = await getGovernanceEnhancedService()
      await svc.dissolveCommittee(id)
      const data = await svc.getCommittee(id)
      setCommittee(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to dissolve committee")
    }
  }

  const meetingColumns: Column<CommitteeMeeting>[] = [
    { key: "title", header: "Meeting", render: (m) => (
      <Link href={`/app/governance-enhanced/meetings/${m.id}`} className="text-[#3CA4F9] hover:underline">{m.title}</Link>
    )},
    { key: "meetingDate", header: "Date", render: (m) => <span className="text-gray-400">{new Date(m.meetingDate).toLocaleDateString()}</span> },
    { key: "status", header: "Status", render: (m) => <StatusBadge status={m.status} /> },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>

  if (error || !committee) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Committee not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Committees
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={committee.name} description={COMMITTEE_TYPE_LABELS[committee.committeeType]} />
        {committee.status === "active" && (
          <button onClick={handleDissolve} className="inline-flex items-center gap-2 rounded-lg bg-red-600/80 px-4 py-2 text-sm text-white hover:bg-red-500 transition-colors">
            <XCircle className="h-4 w-4" /> Dissolve
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Committee Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={committee.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm text-white mt-1">{COMMITTEE_TYPE_LABELS[committee.committeeType]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Chairperson</p>
                <p className="text-sm text-white mt-1">{committee.chairpersonName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Frequency</p>
                <p className="text-sm text-white mt-1 capitalize">{committee.meetingFrequency}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Quorum</p>
                <p className="text-sm text-white mt-1">{committee.quorumRequired} members</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Formed</p>
                <p className="text-sm text-white mt-1">{new Date(committee.formationDate).toLocaleDateString()}</p>
              </div>
            </div>
            {committee.description && (
              <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-white mt-1">{committee.description}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Members ({committee.members.length})</h3>
            {committee.members.length > 0 ? (
              <div className="space-y-2">
                {committee.members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                    <div>
                      <p className="text-sm text-white">{m.memberName}</p>
                      <p className="text-xs text-gray-500">{m.role}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(m.appointedDate).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No members assigned yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Meetings ({meetings.length})</h3>
              <Link
                href={`/app/governance-enhanced/meetings/new`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3CA4F9]/20 text-[#3CA4F9] text-xs hover:bg-[#3CA4F9]/30 transition-colors"
              >
                <CalendarDays className="h-3 w-3" /> Schedule
              </Link>
            </div>
            <DataTable columns={meetingColumns} data={meetings} emptyMessage="No meetings scheduled." />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Leadership</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Chairperson</p>
                <p className="text-sm font-medium text-white mt-1">{committee.chairpersonName}</p>
              </div>
              {committee.viceChairpersonName && (
                <div className="p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Vice Chairperson</p>
                  <p className="text-sm font-medium text-white mt-1">{committee.viceChairpersonName}</p>
                </div>
              )}
              {committee.secretaryName && (
                <div className="p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Secretary</p>
                  <p className="text-sm font-medium text-white mt-1">{committee.secretaryName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
