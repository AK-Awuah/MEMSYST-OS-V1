"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getFormsService } from "@/lib/services"
import type { FormSubmission } from "@/types"
import { ArrowLeft, Mail, Phone, Globe, Calendar, User } from "lucide-react"

export default function FormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<FormSubmission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFormsService().then((svc) =>
      svc.getSubmission(params.id as string).then((data) => {
        setSubmission(data)
        setLoading(false)
      })
    )
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  if (!submission) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Submission not found</p>
        <button onClick={() => router.push("/app/forms")} className="mt-4 text-[#3CA4F9] underline">Back to Forms</button>
      </div>
    )
  }

  const formData = submission.data as Record<string, string>

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={`${submission.type.charAt(0).toUpperCase() + submission.type.slice(1)} Submission`}
        description={`Submitted ${new Date(submission.createdAt).toLocaleDateString()}`}
        actions={
          <button onClick={() => router.back()} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
          <div className="mt-2"><StatusBadge status={submission.status} variant="submission" /></div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Type</p>
          <p className="mt-1 text-lg font-semibold text-white capitalize">{submission.type}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Assigned To</p>
          <p className="mt-1 text-lg font-semibold text-white">{submission.assignedTo || "Unassigned"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Submission Details</h3>
        <div className="space-y-3">
          {formData.firstName && formData.lastName && (
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-300">{formData.firstName} {formData.lastName}</span>
            </div>
          )}
          {formData.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-[#3CA4F9]">{formData.email}</span>
            </div>
          )}
          {formData.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-300">{formData.phone}</span>
            </div>
          )}
          {submission.sourcePage && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-gray-400">Source: {submission.sourcePage}</span>
            </div>
          )}
          {submission.referralSource && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-gray-400">Referral: {submission.referralSource}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">{new Date(submission.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {formData.message && (
          <div className="mt-6">
            <label className="form-label mb-2">Message</label>
            <div className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4 text-sm text-gray-300">
              {formData.message}
            </div>
          </div>
        )}
      </div>

      {submission.notes.length > 0 && (
        <div className="mt-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Notes</h3>
          <div className="space-y-3">
            {submission.notes.map((n) => (
              <div key={n.id} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
                <p className="text-sm text-gray-300">{n.content}</p>
                <p className="mt-1 text-xs text-gray-600">{n.author} · {new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
