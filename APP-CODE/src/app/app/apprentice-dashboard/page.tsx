"use client"

import { useState, useEffect } from "react"
import { GraduationCap, UserCheck, Calendar, Bell, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getApprenticeService, getMemberService } from "@/lib/services"
import { APPRENTICE_STATUS_LABELS } from "@/lib/constants"
import type { Apprentice, Member } from "@/types"

export default function ApprenticeDashboardPage() {
  const [apprentice, setApprentice] = useState<Apprentice | null>(null)
  const [parentMember, setParentMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const apprSvc = await getApprenticeService()
        const all = await apprSvc.listApprentices("tenant-1")
        const current = all.find((a) => a.id === "appr-1") || all[0]
        if (!current) { setLoading(false); return }
        setApprentice(current)
        const memSvc = await getMemberService()
        const parent = await memSvc.getMember(current.parentMemberId)
        setParentMember(parent)
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (!apprentice) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">No apprentice profile found</div>

  const startDate = new Date(apprentice.startDate)
  const endDate = new Date(apprentice.expectedCompletionDate)
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / 86400000)
  const elapsedDays = Math.round((Date.now() - startDate.getTime()) / 86400000)
  const progressPct = Math.min(100, Math.round(elapsedDays / totalDays * 100))

  return (
    <div className="space-y-6">
      <PageHeader title="Apprentice Dashboard" description={`Welcome, ${apprentice.firstName}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Training Status</p>
          <p className={`mt-1 text-lg font-semibold ${apprentice.status === "active" ? "text-green-400" : "text-yellow-400"}`}>{APPRENTICE_STATUS_LABELS[apprentice.status]}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Trade</p>
          <p className="mt-1 text-lg font-semibold text-[#3CA4F9]">{apprentice.trade}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Parent Member</p>
          <p className="mt-1 text-lg font-semibold text-white">{parentMember ? `${parentMember.firstName} ${parentMember.lastName}` : "—"}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Progress</p>
          <p className="mt-1 text-lg font-semibold text-purple-400">{progressPct}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Training Progress</h3>
          <div className="mb-2 h-3 w-full rounded-full bg-[#1e3a5f]">
            <div className="h-3 rounded-full bg-gradient-to-r from-[#3CA4F9] to-purple-500" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Started: {startDate.toLocaleDateString()}</span>
            <span>Expected: {endDate.toLocaleDateString()}</span>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Days elapsed:</span><span className="text-white">{elapsedDays}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Days remaining:</span><span className="text-white">{Math.max(0, totalDays - elapsedDays)}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Notifications</h3>
          <div className="space-y-3">
            {apprentice.status === "active" && <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-400"><GraduationCap className="h-4 w-4" /> Training in progress</div>}
            {apprentice.status === "pending" && <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-400"><Bell className="h-4 w-4" /> Pending activation</div>}
            {progressPct >= 90 && <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 p-3 text-sm text-purple-400"><GraduationCap className="h-4 w-4" /> Approaching completion</div>}
            {progressPct < 90 && apprentice.status === "active" && <p className="text-sm text-gray-500">No new notifications</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
