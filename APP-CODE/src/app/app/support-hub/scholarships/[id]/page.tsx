"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Award, XCircle, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { SCHOLARSHIP_TYPE_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { Scholarship, ScholarshipApplication } from "@/types"

export default function ScholarshipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [applications, setApplications] = useState<ScholarshipApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const [awarding, setAwarding] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const [scholarshipData, applicationsData] = await Promise.all([
          svc.getScholarship(id),
          svc.listScholarshipApplications(id),
        ])
        if (!cancelled) {
          setScholarship(scholarshipData)
          setApplications(applicationsData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load scholarship")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleClose = async () => {
    setClosing(true)
    try {
      const svc = await getSupportHubService()
      await svc.updateScholarship(id, { status: "closed" })
      const data = await svc.getScholarship(id)
      setScholarship(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to close scholarship")
    } finally {
      setClosing(false)
    }
  }

  const handleAward = async (applicationId: string) => {
    setAwarding(applicationId)
    try {
      const svc = await getSupportHubService()
      await svc.awardScholarship(applicationId)
      const [scholarshipData, applicationsData] = await Promise.all([
        svc.getScholarship(id),
        svc.listScholarshipApplications(id),
      ])
      setScholarship(scholarshipData)
      setApplications(applicationsData)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to award application")
    } finally {
      setAwarding(null)
    }
  }

  const applicationColumns: Column<ScholarshipApplication>[] = [
    {
      key: "memberName",
      header: "Applicant",
      render: (a) => <span className="font-medium text-white">{a.memberName}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: "applicationDate",
      header: "Applied Date",
      render: (a) => <span className="text-gray-400">{new Date(a.applicationDate).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading scholarship...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  if (!scholarship) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          Scholarship not found.
        </div>
      </div>
    )
  }

  const canClose = scholarship.status !== "closed" && scholarship.status !== "awarded" && scholarship.status !== "cancelled"
  const canAward = scholarship.status === "accepting_applications" || scholarship.status === "open"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Scholarships
      </button>

      <PageHeader
        title={scholarship.title}
        description={`${SCHOLARSHIP_TYPE_LABELS[scholarship.scholarshipType]} - $${scholarship.amount.toLocaleString()}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Scholarship Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-medium text-white mt-1">{SCHOLARSHIP_TYPE_LABELS[scholarship.scholarshipType]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={scholarship.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-medium text-white mt-1">{scholarship.provider}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium text-white mt-1">${scholarship.amount.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Slots</p>
                <p className="text-sm font-medium text-white mt-1">{scholarship.slotsFilled}/{scholarship.totalSlots}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Application Deadline</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm font-medium text-white mt-1">{scholarship.description}</p>
            </div>
            {scholarship.eligibilityCriteria.length > 0 && (
              <div className="mt-3 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500 mb-2">Eligibility Criteria</p>
                <ul className="list-disc list-inside text-sm text-white space-y-1">
                  {scholarship.eligibilityCriteria.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
            {scholarship.requirements.length > 0 && (
              <div className="mt-3 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500 mb-2">Requirements</p>
                <ul className="list-disc list-inside text-sm text-white space-y-1">
                  {scholarship.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Applications ({applications.length})</h3>
            <DataTable
              columns={applicationColumns}
              data={applications}
              emptyMessage="No applications received yet."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {canClose && (
                <button
                  onClick={handleClose}
                  disabled={closing}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {closing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  {closing ? "Closing..." : "Close Scholarship"}
                </button>
              )}
            </div>
          </div>

          {canAward && applications.filter((a) => a.status === "submitted" || a.status === "under_review" || a.status === "shortlisted").length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Award Applications</h3>
              <div className="space-y-2">
                {applications
                  .filter((a) => a.status === "submitted" || a.status === "under_review" || a.status === "shortlisted")
                  .map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-[#012a42]/50 border border-[#1e3a5f]">
                      <span className="text-sm text-white">{app.memberName}</span>
                      <button
                        onClick={() => handleAward(app.id)}
                        disabled={awarding === app.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/80 text-xs text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {awarding === app.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Award className="h-3 w-3" />}
                        Award
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
