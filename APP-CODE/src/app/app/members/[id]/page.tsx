"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { PageHeader, Tabs } from "@/components/admin"
import { getMemberService } from "@/lib/services"
import type { Member } from "@/types"
import { OverviewTab } from "@/components/admin/members/OverviewTab"
import { ProfileTab } from "@/components/admin/members/ProfileTab"
import { MemberApprenticesTab } from "@/components/admin/members/MemberApprenticesTab"
import { RenewalsTab } from "@/components/admin/members/RenewalsTab"
import { MemberDocumentsTab } from "@/components/admin/members/MemberDocumentsTab"
import { PreferencesTab } from "@/components/admin/members/PreferencesTab"
import { MemberAuditTab } from "@/components/admin/members/MemberAuditTab"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "profile", label: "Profile" },
  { id: "apprentices", label: "Apprentices" },
  { id: "renewals", label: "Renewals" },
  { id: "documents", label: "Documents" },
  { id: "preferences", label: "Preferences" },
  { id: "audit", label: "Audit" },
]

export default function MemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getMemberService()
        const data = await svc.getMember(params.id as string)
        setMember(data)
      } catch {
        setError("Failed to load member")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  }

  if (error || !member) {
    return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Member not found"}</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${member.firstName} ${member.lastName}`}
        description={`${member.membershipNumber} · ${member.category}`}
        actions={
          <button onClick={() => router.push("/app/members")} className="flex items-center gap-1.5 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "overview" && <OverviewTab member={member} />}
        {activeTab === "profile" && <ProfileTab member={member} onUpdate={setMember} />}
        {activeTab === "apprentices" && <MemberApprenticesTab member={member} />}
        {activeTab === "renewals" && <RenewalsTab member={member} />}
        {activeTab === "documents" && <MemberDocumentsTab member={member} />}
        {activeTab === "preferences" && <PreferencesTab member={member} />}
        {activeTab === "audit" && <MemberAuditTab member={member} />}
      </div>
    </div>
  )
}
