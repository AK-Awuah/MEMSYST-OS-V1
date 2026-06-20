"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { REPORT_TYPES, REPORT_TYPE_LABELS, REPORT_FORMATS, REPORT_FORMAT_LABELS, REPORT_SCHEDULES, REPORT_SCHEDULE_LABELS } from "@/lib/constants"
import { getAnalyticsService } from "@/lib/services"
import type { ReportType, ReportFormat, ReportSchedule } from "@/types"

export default function NewReportPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reportType, setReportType] = useState<ReportType>("membership")
  const [format, setFormat] = useState<ReportFormat>("pdf")
  const [schedule, setSchedule] = useState<ReportSchedule>("none")
  const [recipients, setRecipients] = useState("")

  const handleSubmit = async () => {
    if (!title) return
    setSubmitting(true)
    try {
      const svc = await getAnalyticsService()
      await svc.createReport({
        tenantId: "tenant-1",
        title,
        description,
        reportType,
        format,
        filters: {},
        schedule,
        recipients: recipients ? recipients.split(",").map((r) => r.trim()) : [],
        status: "draft",
        createdBy: "admin-1",
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/analytics/reports"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create report")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Save className="h-8 w-8 text-green-400" />
        </div>
        <p className="text-lg font-medium text-white">Report created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Reports
      </button>
      <PageHeader title="New Report" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Report title" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Report description" rows={3} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              {REPORT_TYPES.map((t) => (<option key={t} value={t}>{REPORT_TYPE_LABELS[t]}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as ReportFormat)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              {REPORT_FORMATS.map((f) => (<option key={f} value={f}>{REPORT_FORMAT_LABELS[f]}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Schedule</label>
            <select value={schedule} onChange={(e) => setSchedule(e.target.value as ReportSchedule)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              {REPORT_SCHEDULES.map((s) => (<option key={s} value={s}>{REPORT_SCHEDULE_LABELS[s]}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Recipients (comma-separated emails)</label>
          <input type="text" value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="admin@example.com, manager@example.com" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={submitting || !title}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Report"}
        </button>
      </div>
    </div>
  )
}
