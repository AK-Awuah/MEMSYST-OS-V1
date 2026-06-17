"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCRMService } from "@/lib/services"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { CRMOpportunity, CRMStage } from "@/types"
import { ArrowLeft, TrendingUp, DollarSign, Target } from "lucide-react"

const stageLabels: Record<CRMStage, string> = {
  new_lead: "New Lead", contacted: "Contacted", discovery_meeting: "Discovery Meeting",
  needs_assessment: "Needs Assessment", proposal_sent: "Proposal Sent",
  negotiation: "Negotiation", approved: "Approved", tenant_creation: "Tenant Creation",
}

export default function CRMOpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<CRMOpportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    getCRMService().then((svc) => {
      svc.getOpportunity(params.id as string).then((o) => {
        setOpportunity(o)
        setLoading(false)
      })
    })
  }, [params.id])

  async function handleStageChange(stage: CRMStage) {
    if (!opportunity) return
    setUpdating(true)
    const svc = await getCRMService()
    await svc.updateStage(opportunity.id, stage)
    setOpportunity({ ...opportunity, currentStage: stage })
    setUpdating(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!opportunity) {
    return <div className="py-20 text-center text-gray-400">Opportunity not found.</div>
  }

  return (
    <div className="max-w-4xl">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to CRM Pipeline
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Opportunity Detail</h1>
        <p className="mt-1 text-sm text-gray-400">Created {new Date(opportunity.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge status={opportunity.currentStage} variant="stage" />
        {(["new_lead", "contacted", "discovery_meeting", "needs_assessment", "proposal_sent", "negotiation", "approved", "tenant_creation"] as CRMStage[]).map((s) => (
          <button
            key={s}
            onClick={() => handleStageChange(s)}
            disabled={updating || opportunity.currentStage === s}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              opportunity.currentStage === s
                ? "border-[#3CA4F9] bg-[#3CA4F9]/15 text-[#3CA4F9]"
                : "border-[#1e3a5f] text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"
            } disabled:opacity-50`}
          >
            {stageLabels[s]}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-1 text-xs text-gray-500">Value</div>
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <DollarSign className="h-5 w-5 text-[#3CA4F9]" />
            GH₵{opportunity.value.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-1 text-xs text-gray-500">Probability</div>
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <Target className="h-5 w-5 text-[#3CA4F9]" />
            {opportunity.probability}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1e3a5f]">
            <div className="h-full rounded-full bg-[#3CA4F9] transition-all" style={{ width: `${opportunity.probability}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-1 text-xs text-gray-500">Expected Close</div>
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <TrendingUp className="h-5 w-5 text-[#3CA4F9]" />
            {opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Activity Timeline</h2>
        {opportunity.activities.length === 0 && <p className="text-sm text-gray-500">No activities recorded for this opportunity.</p>}
        <div className="space-y-3">
          {opportunity.activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
              <div className="flex-1">
                <p className="text-sm text-white">{act.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{act.performedBy} · {new Date(act.createdAt).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-[#1e3a5f] px-2 py-0.5 text-[10px] font-medium text-gray-400 capitalize">{act.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
