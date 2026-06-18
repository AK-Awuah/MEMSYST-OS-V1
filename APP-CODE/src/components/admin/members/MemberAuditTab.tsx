"use client"

import { useState, useEffect } from "react"
import { Loader2, Activity } from "lucide-react"
import type { Member, MembershipAuditLog } from "@/types"
import { getMembershipAuditService } from "@/lib/services"

export function MemberAuditTab({ member }: { member: Member }) {
  const [events, setEvents] = useState<MembershipAuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const svc = await getMembershipAuditService()
      const data = await svc.listEvents(member.tenantId, { memberId: member.id })
      setEvents(data)
      setLoading(false)
    }
    load()
  }, [member.id, member.tenantId])

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Activity Log</h3>

      {events.length === 0 && (
        <div className="flex flex-col items-center py-10 text-gray-500">
          <Activity className="mb-2 h-10 w-10" />
          <p className="text-sm">No activity recorded for this member</p>
        </div>
      )}

      <div className="space-y-3">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-start gap-3 border-l-2 border-[#3CA4F9]/30 pl-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{evt.action.replace(/_/g, " ")}</p>
              <p className="text-xs text-gray-500">{evt.newValue}</p>
              <p className="text-xs text-gray-600">by {evt.actor}</p>
            </div>
            <span className="whitespace-nowrap text-xs text-gray-500">{new Date(evt.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
