"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserCheck, RefreshCw, GraduationCap, Bell, Loader2, Mail, Phone, MapPin } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getMemberService, getApprenticeService, getRenewalService, getMembershipAuditService } from "@/lib/services"
import type { Member, Apprentice, RenewalRecord, MembershipAuditLog } from "@/types"
import { MEMBERSHIP_STATUS_LABELS, MEMBER_RENEWAL_STATUS_LABELS } from "@/lib/constants"

export default function MemberDashboardPage() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [apprentices, setApprentices] = useState<Apprentice[]>([])
  const [renewals, setRenewals] = useState<RenewalRecord[]>([])
  const [events, setEvents] = useState<MembershipAuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const memSvc = await getMemberService()
        const members = await memSvc.getMembersByTenant("tenant-1")
        const current = members.find((m) => m.id === "mem-1") || members[0]
        if (!current) { setLoading(false); return }
        setMember(current)
        const [apprSvc, renSvc, audSvc] = await Promise.all([getApprenticeService(), getRenewalService(), getMembershipAuditService()])
        const [apprs, rens, evts] = await Promise.all([
          apprSvc.getApprenticesByMember(current.id),
          renSvc.getMemberRenewals(current.id),
          audSvc.listEvents(current.tenantId, { memberId: current.id }),
        ])
        setApprentices(apprs)
        setRenewals(rens)
        setEvents(evts)
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (!member) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">No member profile found</div>

  const profileCompleteness = [member.firstName, member.lastName, member.email, member.phone, member.profession].filter(Boolean).length / 5 * 100

  return (
    <div className="space-y-6">
      <PageHeader title="Member Dashboard" description={`Welcome back, ${member.firstName}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Membership Status</p>
          <p className={`mt-1 text-lg font-semibold ${member.status === "active" ? "text-green-400" : "text-yellow-400"}`}>{MEMBERSHIP_STATUS_LABELS[member.status]}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Membership Number</p>
          <p className="mt-1 text-lg font-semibold text-[#3CA4F9]">{member.membershipNumber}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Renewal Status</p>
          <p className={`mt-1 text-lg font-semibold ${member.renewalStatus === "current" ? "text-green-400" : member.renewalStatus === "due_soon" ? "text-yellow-400" : "text-red-400"}`}>{MEMBER_RENEWAL_STATUS_LABELS[member.renewalStatus]}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Apprentices</p>
          <p className="mt-1 text-lg font-semibold text-[#3CA4F9]">{apprentices.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">My Profile</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Email:</span><span className="text-white">{member.email}</span></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Phone:</span><span className="text-white">{member.phone}</span></div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Address:</span><span className="text-white">{member.address}</span></div>
            <div className="mt-4">
              <p className="mb-2 text-xs text-gray-500">Profile Completeness</p>
              <div className="h-2 w-full rounded-full bg-[#1e3a5f]">
                <div className="h-2 rounded-full bg-[#3CA4F9]" style={{ width: `${profileCompleteness}%` }} />
              </div>
              <p className="mt-1 text-xs text-gray-500">{Math.round(profileCompleteness)}% complete</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Notifications</h3>
          <div className="space-y-3">
            {member.renewalStatus === "due_soon" && <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-400"><Bell className="h-4 w-4" /> Renewal due soon</div>}
            {apprentices.filter((a) => a.status === "pending").length > 0 && <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3 text-sm text-blue-400"><GraduationCap className="h-4 w-4" /> {apprentices.filter((a) => a.status === "pending").length} apprentice(s) pending</div>}
            {renewals.length === 0 && <p className="text-sm text-gray-500">No notifications</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">My Apprentices</h3>
          {apprentices.length === 0 ? <p className="text-sm text-gray-500">No apprentices registered</p> : (
            <div className="space-y-3">
              {apprentices.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
                  <p className="text-sm text-white">{a.firstName} {a.lastName}</p>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400">{a.trade}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
          {events.length === 0 ? <p className="text-sm text-gray-500">No recent activity</p> : (
            <div className="space-y-3">
              {events.slice(0, 5).map((e) => (
                <div key={e.id} className="border-l-2 border-[#3CA4F9]/30 pl-3">
                  <p className="text-sm text-white">{e.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
