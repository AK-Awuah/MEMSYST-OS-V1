"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Play } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { REPORT_TYPE_LABELS, REPORT_FORMAT_LABELS, REPORT_SCHEDULE_LABELS } from "@/lib/constants"
import { getAnalyticsService } from "@/lib/services"
import type { Report, ReportExecution } from "@/types"

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [executions, setExecutions] = useState<ReportExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAnalyticsService()
        const [reportData, execData] = await Promise.all([
          svc.getReport(id),
          svc.listExecutions(id),
        ])
        if (!cancelled) { setReport(reportData); setExecutions(execData) }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load report")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const svc = await getAnalyticsService()
      await svc.generateReport(id, "manual")
      const execs = await svc.listExecutions(id)
      setExecutions(execs)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to generate report")
    } finally {
      setGenerating(false)
    }
  }

  const execColumns: Column<ReportExecution>[] = [
    { key: "executedAt", header: "Executed", render: (e) => <span className="text-gray-400 text-xs">{new Date(e.executedAt).toLocaleString()}</span> },
    { key: "status", header: "Status", render: (e) => <StatusBadge status={e.status} /> },
    { key: "rowCount", header: "Rows", render: (e) => <span className="text-gray-400">{e.rowCount ?? "-"}</span> },
    { key: "triggeredBy", header: "Trigger", render: (e) => <span className="text-gray-400 capitalize">{e.triggeredBy}</span> },
    { key: "outputUrl", header: "Output", render: (e) => e.outputUrl ? (
      <a href={e.outputUrl} target="_blank" rel="noopener noreferrer" className="text-[#3CA4F9] text-xs hover:underline">Download</a>
    ) : <span className="text-gray-500">-</span> },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (error || !report) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Report not found."}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Reports
      </button>

      <div className="flex items-start justify-between">
        <PageHeader title={report.title} description={`${REPORT_TYPE_LABELS[report.reportType]} - ${REPORT_FORMAT_LABELS[report.format]}`} />
        <button onClick={handleGenerate} disabled={generating}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50 transition-colors">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {generating ? "Generating..." : "Generate Now"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Report Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm text-white mt-1">{REPORT_TYPE_LABELS[report.reportType]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Format</p>
                <p className="text-sm text-white mt-1">{REPORT_FORMAT_LABELS[report.format]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Schedule</p>
                <p className="text-sm text-white mt-1">{REPORT_SCHEDULE_LABELS[report.schedule]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={report.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Last Generated</p>
                <p className="text-sm text-white mt-1">{report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : "Never"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created By</p>
                <p className="text-sm text-white mt-1">{report.createdBy}</p>
              </div>
            </div>
            {report.description && (
              <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-white mt-1">{report.description}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Executions ({executions.length})</h3>
            <DataTable columns={execColumns} data={executions} emptyMessage="No executions yet." />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recipients</h3>
            {report.recipients.length > 0 ? (
              <ul className="space-y-1.5">
                {report.recipients.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3CA4F9]" />{r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recipients configured.</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Filters</h3>
            <p className="text-sm text-gray-500">Custom filter configuration.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
