"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, UserCheck, UserX, Users, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getMemberService } from "@/lib/services"
import { MEMBERSHIP_STATUS_LABELS, MEMBERSHIP_STATUSES } from "@/lib/constants"
import type { Member } from "@/types"

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const svc = await getMemberService()
        const data = await svc.listMembers("tenant-1")
        setMembers(data)
      } catch {
        setError("Failed to load members")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    pending: members.filter((m) => m.status === "pending").length,
    suspended: members.filter((m) => m.status === "suspended" || m.status === "inactive").length,
  }), [members])

  const categories = useMemo(() => [...new Set(members.map((m) => m.category))], [members])

  const filtered = useMemo(() => {
    let result = members
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((m) => m.firstName.toLowerCase().includes(s) || m.lastName.toLowerCase().includes(s) || m.membershipNumber.toLowerCase().includes(s) || m.email.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") result = result.filter((m) => m.status === statusFilter)
    if (categoryFilter !== "all") result = result.filter((m) => m.category === categoryFilter)
    return result
  }, [members, search, statusFilter, categoryFilter])

  const columns: Column<Member>[] = [
    { key: "membershipNumber", header: "Mem #", render: (m) => <span className="font-mono text-xs text-[#3CA4F9]">{m.membershipNumber}</span> },
    { key: "name", header: "Name", render: (m) => `${m.firstName} ${m.lastName}` },
    { key: "email", header: "Email" },
    { key: "category", header: "Category" },
    { key: "phone", header: "Phone" },
    { key: "status", header: "Status", render: (m) => <StatusBadge status={m.status} /> },
    { key: "approvalStatus", header: "Approval", render: (m) => <ApprovalBadge status={m.approvalStatus} /> },
    { key: "renewalStatus", header: "Renewal", render: (m) => <RenewalBadge status={m.renewalStatus} /> },
  ]

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <p>{error}</p>
        <button onClick={() => setError("")} className="mt-2 text-sm underline">Dismiss</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Members" description="Manage all tenant members" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={stats.total} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Pending" value={stats.pending} icon={<Loader2 className="h-5 w-5" />} />
        <StatCard title="Suspended/Inactive" value={stats.suspended} icon={<UserX className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {MEMBERSHIP_STATUSES.map((s) => <option key={s} value={s}>{MEMBERSHIP_STATUS_LABELS[s]}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => router.push("/app/members/new")} className="flex items-center gap-1.5 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]">
          <Plus className="h-4 w-4" /> New Member
        </button>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} onRowClick={(m) => router.push(`/app/members/${m.id}`)} emptyMessage="No members found" />
    </div>
  )
}

function StatusBadge({ status }: { status: Member["status"] }) {
  const colors: Record<string, string> = { pending: "bg-yellow-500/20 text-yellow-400", active: "bg-green-500/20 text-green-400", inactive: "bg-gray-500/20 text-gray-400", suspended: "bg-red-500/20 text-red-400", expired: "bg-orange-500/20 text-orange-400", cancelled: "bg-red-600/20 text-red-500", deceased: "bg-gray-600/20 text-gray-500" }
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-500/20 text-gray-400"}`}>{MEMBERSHIP_STATUS_LABELS[status] || status}</span>
}

function ApprovalBadge({ status }: { status: Member["approvalStatus"] }) {
  const colors: Record<string, string> = { invited: "bg-blue-500/20 text-blue-400", pending_verification: "bg-yellow-500/20 text-yellow-400", under_review: "bg-purple-500/20 text-purple-400", approved: "bg-green-500/20 text-green-400", active: "bg-green-600/20 text-green-500", rejected: "bg-red-500/20 text-red-400", inactive: "bg-gray-500/20 text-gray-400" }
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-500/20 text-gray-400"}`}>{status.replace(/_/g, " ")}</span>
}

function RenewalBadge({ status }: { status: Member["renewalStatus"] }) {
  const colors: Record<string, string> = { current: "bg-green-500/20 text-green-400", due_soon: "bg-yellow-500/20 text-yellow-400", overdue: "bg-red-500/20 text-red-400", renewed: "bg-blue-500/20 text-blue-400", expired: "bg-gray-500/20 text-gray-400" }
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-500/20 text-gray-400"}`}>{status.replace(/_/g, " ")}</span>
}
