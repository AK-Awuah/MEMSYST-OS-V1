"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getOrganizationService } from "@/lib/services"
import type { OrganizationProspect } from "@/types"
import { ArrowLeft, Building2, Users, Globe, Calendar, FileText } from "lucide-react"

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [prospect, setProspect] = useState<OrganizationProspect | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrganizationService().then((svc) =>
      svc.getProspect(params.id as string).then((data) => {
        setProspect(data)
        setLoading(false)
      })
    )
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!prospect) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Organization not found</p>
        <button onClick={() => router.push("/app/organizations")} className="mt-4 text-[#3CA4F9] underline">Back to Organizations</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={prospect.organizationName}
        description="Organization prospect details"
        actions={
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
          <div className="mt-2"><StatusBadge status={prospect.status} variant="prospect" /></div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Industry</p>
            <Building2 className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">{prospect.industryType}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Members</p>
            <Users className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">{prospect.expectedMembers.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Country</p>
            <Globe className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">{prospect.country}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Prospect Details</h3>
        <div className="space-y-4">
          <div>
            <label className="form-label text-xs">Current Challenges</label>
            <p className="text-sm text-gray-300">{prospect.currentChallenges || "No information provided."}</p>
          </div>
          <div>
            <label className="form-label text-xs">Desired Capabilities</label>
            {prospect.desiredCapabilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {prospect.desiredCapabilities.map((c, i) => (
                  <span key={i} className="rounded bg-[#3CA4F9]/10 px-2 py-1 text-xs text-[#3CA4F9]">{c}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">None specified.</p>
            )}
          </div>
          {prospect.commercialNotes && (
            <div>
              <label className="form-label text-xs">Commercial Notes</label>
              <p className="text-sm text-gray-300">{prospect.commercialNotes}</p>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">Added {new Date(prospect.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
