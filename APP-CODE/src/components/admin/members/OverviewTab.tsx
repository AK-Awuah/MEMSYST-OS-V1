"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Briefcase, Calendar, UserCheck } from "lucide-react"
import type { Member, MembershipAuditLog } from "@/types"
import { getMembershipAuditService, getApprenticeService } from "@/lib/services"
import { MEMBERSHIP_STATUS_LABELS, MEMBER_APPROVAL_STATUS_LABELS, MEMBER_RENEWAL_STATUS_LABELS } from "@/lib/constants"

export function OverviewTab({ member }: { member: Member }) {
  const [events, setEvents] = useState<MembershipAuditLog[]>([])
  const [apprenticeCount, setApprenticeCount] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const [auditSvc, apprSvc] = await Promise.all([getMembershipAuditService(), getApprenticeService()])
        const [evts, apprs] = await Promise.all([
          auditSvc.listEvents(member.tenantId, { memberId: member.id }),
          apprSvc.getApprenticesByMember(member.id),
        ])
        setEvents(evts)
        setApprenticeCount(apprs.length)
      } catch {}
    }
    load()
  }, [member.id, member.tenantId])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Status</p>
          <p className={`mt-1 text-lg font-semibold ${member.status === "active" ? "text-green-400" : member.status === "pending" ? "text-yellow-400" : "text-red-400"}`}>{MEMBERSHIP_STATUS_LABELS[member.status]}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Approval</p>
          <p className="mt-1 text-lg font-semibold text-purple-400">{MEMBER_APPROVAL_STATUS_LABELS[member.approvalStatus]}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Renewal</p>
          <p className="mt-1 text-lg font-semibold text-blue-400">{MEMBER_RENEWAL_STATUS_LABELS[member.renewalStatus]}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500">Apprentices</p>
          <p className="mt-1 text-lg font-semibold text-[#3CA4F9]">{apprenticeCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Personal Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><UserCheck className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Name:</span><span className="text-white">{member.firstName} {member.middleName} {member.lastName}</span></div>
            <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">DOB:</span><span className="text-white">{member.dateOfBirth || "—"}</span></div>
            <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Gender:</span><span className="text-white">{member.gender}</span></div>
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Email:</span><span className="text-white">{member.email}</span></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Phone:</span><span className="text-white">{member.phone}</span></div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Address:</span><span className="text-white">{member.address}, {member.city}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Professional Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-[#3CA4F9]" /><span className="text-gray-400">Profession:</span><span className="text-white">{member.profession}</span></div>
            <div className="flex items-center gap-3"><span className="text-gray-400">Specialization:</span><span className="text-white">{member.specialization || "—"}</span></div>
            <div className="flex items-center gap-3"><span className="text-gray-400">Business:</span><span className="text-white">{member.businessName || "—"}</span></div>
            <div className="flex items-center gap-3"><span className="text-gray-400">Experience:</span><span className="text-white">{member.yearsOfExperience} years</span></div>
            <div className="flex items-center gap-3"><span className="text-gray-400">Category:</span><span className="text-white">{member.category}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Activity Timeline</h3>
        <div className="space-y-3">
          {events.length === 0 && <p className="text-sm text-gray-500">No activity recorded yet.</p>}
          {events.map((evt) => (
            <div key={evt.id} className="flex items-start gap-3 border-l-2 border-[#3CA4F9]/30 pl-4">
              <div className="flex-1">
                <p className="text-sm text-white">{evt.action.replace(/_/g, " ")}</p>
                <p className="text-xs text-gray-500">{evt.newValue}</p>
              </div>
              <span className="text-xs text-gray-500">{new Date(evt.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
