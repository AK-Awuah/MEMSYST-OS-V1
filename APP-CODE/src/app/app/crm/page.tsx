"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getCRMService } from "@/lib/services"
import type { CRMOpportunity, CRMStage } from "@/types"
import { TrendingUp, DollarSign, Target } from "lucide-react"

const pipelineStages: CRMStage[] = [
  "new_lead", "contacted", "discovery_meeting", "needs_assessment",
  "proposal_sent", "negotiation", "approved", "tenant_creation",
]

const stageLabels: Record<CRMStage, string> = {
  new_lead: "New Lead", contacted: "Contacted", discovery_meeting: "Discovery Meeting",
  needs_assessment: "Needs Assessment", proposal_sent: "Proposal Sent",
  negotiation: "Negotiation", approved: "Approved", tenant_creation: "Tenant Creation",
}

export default function CRMPage() {
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCRMService().then((svc) => {
      svc.listOpportunities().then((data) => {
        setOpportunities(data)
        setLoading(false)
      })
    })
  }, [])

  const totalValue = opportunities.reduce((s, o) => s + o.value, 0)
  const wonValue = opportunities.filter((o) => o.currentStage === "approved" || o.currentStage === "tenant_creation").reduce((s, o) => s + o.value, 0)

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  return (
    <div>
      <PageHeader
        title="CRM Pipeline"
        description="Track opportunities through the sales pipeline"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Opportunities" value={opportunities.length} icon={<Target className="h-5 w-5" />} />
        <StatCard title="Pipeline Value" value={`GH₵${totalValue.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Won Value" value={`GH₵${wonValue.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {pipelineStages.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.currentStage === stage)
          const stageValue = stageOpps.reduce((s, o) => s + o.value, 0)
          return (
            <div key={stage} className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">{stageLabels[stage]}</h3>
                <span className="text-xs text-gray-500">{stageOpps.length}</span>
              </div>
              <div className="space-y-2">
                {stageOpps.length === 0 && (
                  <p className="py-4 text-center text-xs text-gray-600">No opportunities</p>
                )}
                {stageOpps.map((opp) => (
                  <div key={opp.id} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
                    <p className="truncate text-sm font-medium text-white">{opp.leadId}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-[#3CA4F9]">GH₵{opp.value.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{opp.probability}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1e3a5f]">
                      <div className="h-full rounded-full bg-[#3CA4F9] transition-all" style={{ width: `${opp.probability}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-[#1e3a5f] pt-2 text-center text-xs text-gray-500">
                GH₵{stageValue.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
