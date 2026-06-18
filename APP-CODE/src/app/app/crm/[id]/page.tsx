"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getCRMService } from "@/lib/services"
import type { CRMOpportunity } from "@/types"
import { ArrowLeft, DollarSign, Target, Calendar } from "lucide-react"

export default function CRMOpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<CRMOpportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCRMService().then((svc) =>
      svc.getOpportunity(params.id as string).then((data) => {
        setOpportunity(data)
        setLoading(false)
      })
    )
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!opportunity) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Opportunity not found</p>
        <button onClick={() => router.push("/app/crm")} className="mt-4 text-[#3CA4F9] underline">Back to CRM</button>
      </div>
    )
  }

  const stageLabels: Record<string, string> = {
    new_lead: "New Lead", contacted: "Contacted", discovery_meeting: "Discovery Meeting",
    needs_assessment: "Needs Assessment", proposal_sent: "Proposal Sent",
    negotiation: "Negotiation", approved: "Approved", tenant_creation: "Tenant Creation",
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={`Opportunity: ${opportunity.leadId}`}
        description="CRM pipeline opportunity details"
        actions={
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Stage</p>
            <Target className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-sm font-semibold text-white capitalize">{stageLabels[opportunity.currentStage] || opportunity.currentStage}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Value</p>
            <DollarSign className="h-4 w-4 text-green-400" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">GH₵{opportunity.value.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Probability</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1e3a5f]">
              <div className="h-full rounded-full bg-[#3CA4F9] transition-all" style={{ width: `${opportunity.probability}%` }} />
            </div>
            <span className="text-sm font-semibold text-white">{opportunity.probability}%</span>
          </div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Close Date</p>
            <Calendar className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-sm font-semibold text-white">{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Activity Timeline</h3>
        {opportunity.activities.length === 0 ? (
          <p className="text-sm text-gray-500">No activities recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {opportunity.activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 border-b border-[#1e3a5f] pb-3 last:border-0">
                <div className={`mt-0.5 h-2 w-2 rounded-full ${
                  a.type === "meeting" ? "bg-green-400" : a.type === "call" ? "bg-blue-400" : "bg-gray-500"
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  {a.description && <p className="text-xs text-gray-500">{a.description}</p>}
                  <p className="text-xs text-gray-600">{a.performedBy} · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
