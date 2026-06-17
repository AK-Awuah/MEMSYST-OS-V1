"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getFormsService, getAuthService } from "@/lib/services"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { FormSubmission, MemsystUser } from "@/types"
import { ArrowLeft, Send, UserPlus, UserCheck } from "lucide-react"
import { logAuditEvent, createAuditEntry } from "@/lib/audit"
import { useAuth } from "@/features/auth/AuthContext"

export default function FormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [submission, setSubmission] = useState<FormSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [noteContent, setNoteContent] = useState("")
  const [updating, setUpdating] = useState(false)
  const [converting, setConverting] = useState(false)
  const [staff, setStaff] = useState<MemsystUser[]>([])
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    getFormsService().then((svc) => {
      svc.getSubmission(params.id as string).then((s) => {
        setSubmission(s)
        setLoading(false)
      })
    })
    getAuthService().then((svc) => {
      svc.listUsers().then((u) => setStaff(u))
    })
  }, [params.id])

  async function handleAssign(userId: string) {
    if (!submission) return
    const prev = submission.assignedTo || "Unassigned"
    setAssigning(true)
    const svc = await getFormsService()
    await svc.assignSubmission(submission.id, userId)
    const updated = await svc.getSubmission(submission.id)
    if (updated) setSubmission(updated)
    const assignedName = staff.find((s) => s.id === userId)
    await logAuditEvent(createAuditEntry({
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "System",
      role: currentUser?.role || "system",
      action: "ASSIGN",
      module: "FORMS",
      recordType: "FormSubmission",
      recordId: submission.id,
      previousValue: prev,
      newValue: assignedName ? `${assignedName.firstName} ${assignedName.lastName}` : userId,
    }))
    setAssigning(false)
  }

  async function handleStatusChange(status: FormSubmission["status"]) {
    if (!submission) return
    const prev = submission.status
    setUpdating(true)
    const svc = await getFormsService()
    await svc.updateStatus(submission.id, status)
    setSubmission({ ...submission, status })
    await logAuditEvent(createAuditEntry({
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "System",
      role: currentUser?.role || "system",
      action: "STATUS_CHANGE",
      module: "FORMS",
      recordType: "FormSubmission",
      recordId: submission.id,
      previousValue: prev,
      newValue: status,
    }))
    setUpdating(false)
  }

  async function handleConvertToLead() {
    if (!submission) return
    setConverting(true)
    try {
      const svc = await getFormsService()
      const leadId = await svc.convertToLead(submission.id)
      await logAuditEvent(createAuditEntry({
        actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "System",
        role: currentUser?.role || "system",
        action: "CONVERT",
        module: "FORMS",
        recordType: "FormSubmission",
        recordId: submission.id,
        newValue: `Converted to Lead: ${leadId}`,
      }))
      router.push(`/app/leads/${leadId}`)
    } catch {
      setConverting(false)
    }
  }

  async function handleAddNote() {
    if (!submission || !noteContent.trim()) return
    setUpdating(true)
    const svc = await getFormsService()
    await svc.addNote(submission.id, { content: noteContent, author: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Current User" })
    const updated = await svc.getSubmission(submission.id)
    if (updated) setSubmission(updated)
    await logAuditEvent(createAuditEntry({
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "System",
      role: currentUser?.role || "system",
      action: "UPDATE",
      module: "FORMS",
      recordType: "FormSubmission",
      recordId: submission.id,
      newValue: `Added note: ${noteContent.substring(0, 100)}`,
    }))
    setNoteContent("")
    setUpdating(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!submission) {
    return <div className="py-20 text-center text-gray-400">Submission not found.</div>
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">{submission.type} Submission</h1>
          <p className="mt-1 text-sm text-gray-400">
            Submitted {new Date(submission.createdAt).toLocaleString()} · From {submission.sourcePage}
          </p>
          {submission.assignedTo && (
            <p className="mt-1 text-xs text-[#3CA4F9]">
              <UserCheck className="mr-1 inline h-3.5 w-3.5" />
              Assigned to {staff.find((s) => s.id === submission.assignedTo)?.firstName ?? submission.assignedTo}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Assign:</label>
          <select
            value={submission.assignedTo || ""}
            onChange={(e) => handleAssign(e.target.value)}
            disabled={assigning}
            className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-2 py-1.5 text-xs text-white focus:border-[#3CA4F9]/50 focus:outline-none disabled:opacity-50"
          >
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <StatusBadge status={submission.status} />
        {(["new", "assigned", "in_progress", "resolved", "closed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={updating || submission.status === s}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              submission.status === s
                ? "border-[#3CA4F9] bg-[#3CA4F9]/15 text-[#3CA4F9]"
                : "border-[#1e3a5f] text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
            } disabled:opacity-50`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
        {submission.status !== "resolved" && submission.status !== "closed" && (
          <button
            onClick={handleConvertToLead}
            disabled={converting}
            className="ml-4 flex items-center gap-1.5 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-50"
          >
            <UserPlus className="h-3.5 w-3.5" />
            {converting ? "Converting..." : "Convert to Lead"}
          </button>
        )}
      </div>

      <div className="mb-8 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Submission Data</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {Object.entries(submission.data).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs text-gray-500 capitalize">{key}</dt>
              <dd className="text-sm text-white">{String(value)}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs text-gray-500">Referral Source</dt>
            <dd className="text-sm text-white">{submission.referralSource || "Direct"}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Source Page</dt>
            <dd className="text-sm text-white">{submission.sourcePage}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Notes</h2>
        <div className="mb-4 space-y-3">
          {submission.notes.length === 0 && <p className="text-sm text-gray-500">No notes yet.</p>}
          {submission.notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
              <p className="text-sm text-white">{note.content}</p>
              <p className="mt-1 text-xs text-gray-500">{note.author} · {new Date(note.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
          <button
            onClick={handleAddNote}
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
