"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getLeadsService } from "@/lib/services"
import type { Lead } from "@/types"
import { ArrowLeft, Phone, Mail, Globe, Users, DollarSign, Building2 } from "lucide-react"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeadsService().then((svc) =>
      svc.getLead(params.id as string).then((data) => {
        setLead(data)
        setLoading(false)
      })
    )
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Lead not found</p>
        <button onClick={() => router.push("/app/leads")} className="mt-4 text-[#3CA4F9] underline">Back to Leads</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={lead.organizationName}
        description={`Lead · ${lead.contactPerson}`}
        actions={
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
            <Building2 className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <div className="mt-2"><StatusBadge status={lead.status} variant="lead" /></div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Type</p>
          <p className="mt-1 text-lg font-semibold text-white capitalize">{lead.organizationType}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Value</p>
            <DollarSign className="h-4 w-4 text-green-400" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">GH₵{lead.estimatedValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Members</p>
            <Users className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">{lead.expectedMembers.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Contact Details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">{lead.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">{lead.phone}</span>
          </div>
          {lead.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-[#3CA4F9]">{lead.website}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300 capitalize">{lead.organizationType} · {lead.country}</span>
          </div>
        </div>
      </div>

      {lead.activities.length > 0 && (
        <div className="mt-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Activity History</h3>
          <div className="space-y-3">
            {lead.activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 border-b border-[#1e3a5f] pb-3 last:border-0">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-[#3CA4F9]" />
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  {a.description && <p className="text-xs text-gray-500">{a.description}</p>}
                  <p className="text-xs text-gray-600">{a.performedBy} · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
