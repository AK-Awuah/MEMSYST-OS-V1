"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getLeadsService, getAuthService } from "@/lib/services"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { Lead, LeadStatus, MemsystUser } from "@/types"
import { ArrowLeft, Send, Phone, Mail, Calendar, FileText, UserCog } from "lucide-react"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [noteContent, setNoteContent] = useState("")
  const [activityType, setActivityType] = useState<"note" | "call" | "email" | "meeting">("note")
  const [updating, setUpdating] = useState(false)
  const [users, setUsers] = useState<MemsystUser[]>([])
  const [assignUserId, setAssignUserId] = useState("")

  useEffect(() => {
    getLeadsService().then((svc) => {
      svc.getLead(params.id as string).then((l) => {
        setLead(l)
        setLoading(false)
      })
    })
    getAuthService().then((svc) => svc.listUsers().then(setUsers))
  }, [params.id])

  async function handleStatusChange(status: LeadStatus) {
    if (!lead) return
    setUpdating(true)
    const svc = await getLeadsService()
    await svc.updateStatus(lead.id, status)
    setLead({ ...lead, status })
    setUpdating(false)
  }

  async function handleAddActivity() {
    if (!lead || !noteContent.trim()) return
    setUpdating(true)
    const svc = await getLeadsService()
    await svc.addActivity(lead.id, { type: activityType, title: noteContent, performedBy: "Current User" })
    const updated = await svc.getLead(lead.id)
    if (updated) setLead(updated)
    setNoteContent("")
    setUpdating(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!lead) {
    return <div className="py-20 text-center text-gray-400">Lead not found.</div>
  }

  return (
    <div className="max-w-4xl">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{lead.organizationName}</h1>
        <p className="mt-1 text-sm text-gray-400">Created {new Date(lead.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge status={lead.status} variant="lead" />
        {(["new", "qualified", "meeting_scheduled", "needs_assessment", "proposal_sent", "negotiation", "won", "lost"] as LeadStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={updating || lead.status === s}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              lead.status === s
                ? "border-[#3CA4F9] bg-[#3CA4F9]/15 text-[#3CA4F9]"
                : "border-[#1e3a5f] text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
            } disabled:opacity-50`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Contact Information</h2>
          <dl className="space-y-3">
            <div><dt className="text-xs text-gray-500">Contact Person</dt><dd className="text-sm text-white">{lead.contactPerson}</dd></div>
            <div><dt className="text-xs text-gray-500">Email</dt><dd className="text-sm text-white">{lead.email}</dd></div>
            <div><dt className="text-xs text-gray-500">Phone</dt><dd className="text-sm text-white">{lead.phone}</dd></div>
            <div><dt className="text-xs text-gray-500">Website</dt><dd className="text-sm text-white">{lead.website || "-"}</dd></div>
            <div>
              <dt className="text-xs text-gray-500">Assigned To</dt>
              <dd className="mt-1 flex items-center gap-2">
                <select
                  value={assignUserId || lead.assignedTo || ""}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-2 py-1.5 text-sm text-white"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
                <button
                  onClick={async () => {
                    if (!assignUserId && !lead.assignedTo) return
                    const svc = await getLeadsService()
                    await svc.assignLead(lead.id, assignUserId || "")
                    setLead({ ...lead, assignedTo: assignUserId || "" })
                    setAssignUserId("")
                  }}
                  disabled={updating || (!assignUserId && !lead.assignedTo)}
                  className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0] disabled:opacity-50"
                >
                  <UserCog className="h-3.5 w-3.5" /> Assign
                </button>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Business Information</h2>
          <dl className="space-y-3">
            <div><dt className="text-xs text-gray-500">Organization Type</dt><dd className="text-sm text-white">{lead.organizationType}</dd></div>
            <div><dt className="text-xs text-gray-500">Country</dt><dd className="text-sm text-white">{lead.country}</dd></div>
            <div><dt className="text-xs text-gray-500">Expected Members</dt><dd className="text-sm text-white">{lead.expectedMembers.toLocaleString()}</dd></div>
            <div><dt className="text-xs text-gray-500">Lead Source</dt><dd className="text-sm text-white">{lead.leadSource}</dd></div>
            <div><dt className="text-xs text-gray-500">Estimated Value</dt><dd className="text-sm font-semibold text-[#3CA4F9]">GH₵{lead.estimatedValue.toLocaleString()}</dd></div>
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Activity Timeline</h2>
        {lead.activities.length === 0 && <p className="mb-4 text-sm text-gray-500">No activities recorded yet.</p>}
        <div className="mb-4 space-y-3">
          {lead.activities.map((act) => {
            const iconMap: Record<string, React.ReactNode> = {
              call: <Phone className="h-4 w-4 text-green-400" />,
              email: <Mail className="h-4 w-4 text-blue-400" />,
              meeting: <Calendar className="h-4 w-4 text-purple-400" />,
              note: <FileText className="h-4 w-4 text-yellow-400" />,
            }
            return (
              <div key={act.id} className="flex items-start gap-3 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
                <div className="mt-0.5">{iconMap[act.type] || <FileText className="h-4 w-4 text-gray-400" />}</div>
                <div className="flex-1">
                  <p className="text-sm text-white">{act.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {act.performedBy} · {new Date(act.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-[#1e3a5f] px-2 py-0.5 text-[10px] font-medium text-gray-400 capitalize">
                  {act.type}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mb-3 flex gap-2">
          {(["note", "call", "email", "meeting"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActivityType(type)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                activityType === type
                  ? "border-[#3CA4F9] bg-[#3CA4F9]/15 text-[#3CA4F9]"
                  : "border-[#1e3a5f] text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
              }`}
            >
              {type === "call" && <Phone className="h-3 w-3" />}
              {type === "email" && <Mail className="h-3 w-3" />}
              {type === "meeting" && <Calendar className="h-3 w-3" />}
              {type === "note" && <FileText className="h-3 w-3" />}
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder={`Add a ${activityType}...`}
            className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
          <button
            onClick={handleAddActivity}
            disabled={updating || !noteContent.trim()}
            className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
