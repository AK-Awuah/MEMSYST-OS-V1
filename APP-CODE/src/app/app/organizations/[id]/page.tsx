"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getOrganizationService } from "@/lib/services"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { OrganizationProspect } from "@/types"
import { ArrowLeft } from "lucide-react"
import { logAuditEvent, createAuditEntry } from "@/lib/audit"
import { useAuth } from "@/features/auth/AuthContext"

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [prospect, setProspect] = useState<OrganizationProspect | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    getOrganizationService().then((svc) => {
      svc.getProspect(params.id as string).then((p) => {
        setProspect(p)
        setLoading(false)
      })
    })
  }, [params.id])

  async function handleStatusChange(status: OrganizationProspect["status"]) {
    if (!prospect) return
    const prev = prospect.status
    setUpdating(true)
    const svc = await getOrganizationService()
    await svc.updateProspectStatus(prospect.id, status)
    setProspect({ ...prospect, status })
    await logAuditEvent(createAuditEntry({
      actor: user ? `${user.firstName} ${user.lastName}` : "System",
      role: user?.role || "system",
      action: "status_change",
      module: "ORGANIZATIONS",
      recordType: "OrganizationProspect",
      recordId: prospect.id,
      previousValue: prev,
      newValue: status,
    }))
    setUpdating(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!prospect) {
    return <div className="py-20 text-center text-gray-400">Prospect not found.</div>
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{prospect.organizationName}</h1>
        <p className="mt-1 text-sm text-gray-400">{prospect.industryType} · {prospect.country}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge status={prospect.status} variant="prospect" />
        {(["prospect", "qualified", "proposal_stage", "negotiation", "approved", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={updating || prospect.status === s}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              prospect.status === s
                ? "border-[#3CA4F9] bg-[#3CA4F9]/15 text-[#3CA4F9]"
                : "border-[#1e3a5f] text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
            } disabled:opacity-50`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Details</h2>
          <dl className="space-y-3">
            <div><dt className="text-xs text-gray-500">Expected Members</dt><dd className="text-sm text-white">{prospect.expectedMembers.toLocaleString()}</dd></div>
            <div><dt className="text-xs text-gray-500">Assigned To</dt><dd className="text-sm text-white">{prospect.assignedTo || "Unassigned"}</dd></div>
            <div><dt className="text-xs text-gray-500">Desired Capabilities</dt><dd className="text-sm text-white">{prospect.desiredCapabilities.join(", ") || "None specified"}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Current Challenges</h2>
          <p className="text-sm text-gray-300">{prospect.currentChallenges || "No information provided."}</p>
          {prospect.commercialNotes && (
            <>
              <h3 className="mb-2 mt-4 text-sm font-medium text-white">Commercial Notes</h3>
              <p className="text-sm text-gray-300">{prospect.commercialNotes}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
