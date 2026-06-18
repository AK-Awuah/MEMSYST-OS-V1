"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, GraduationCap, UserCheck, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin/DataTable"
import { getApprenticeService, getMemberService } from "@/lib/services"
import { APPRENTICE_STATUS_LABELS, APPRENTICE_STATUSES } from "@/lib/constants"
import type { Apprentice, Member } from "@/types"

export default function ApprenticesPage() {
  const router = useRouter()
  const [apprentices, setApprentices] = useState<Apprentice[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [apprSvc, memSvc] = await Promise.all([getApprenticeService(), getMemberService()])
        const [apprData, memData] = await Promise.all([apprSvc.listApprentices("tenant-1"), memSvc.getMembersByTenant("tenant-1")])
        setApprentices(apprData)
        setMembers(memData)
      } catch {
        setError("Failed to load apprentices")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const memberMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members])

  const stats = useMemo(() => ({
    total: apprentices.length,
    active: apprentices.filter((a) => a.status === "active").length,
    pending: apprentices.filter((a) => a.status === "pending").length,
    upgraded: apprentices.filter((a) => a.status === "upgraded" || a.status === "completed").length,
  }), [apprentices])

  const filtered = useMemo(() => {
    let result = apprentices
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((a) => a.firstName.toLowerCase().includes(s) || a.lastName.toLowerCase().includes(s) || a.trade.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter)
    return result
  }, [apprentices, search, statusFilter])

  const columns: Column<Apprentice>[] = [
    { key: "name", header: "Name", render: (a) => `${a.firstName} ${a.lastName}` },
    { key: "parentMemberId", header: "Parent Member", render: (a) => { const p = memberMap.get(a.parentMemberId); return p ? `${p.firstName} ${p.lastName}` : "—" } },
    { key: "trade", header: "Trade" },
    { key: "status", header: "Status", render: (a) => <ApprenticeStatusBadge status={a.status} /> },
    { key: "startDate", header: "Started", render: (a) => new Date(a.startDate).toLocaleDateString() },
    { key: "expectedCompletionDate", header: "Expected End", render: (a) => new Date(a.expectedCompletionDate).toLocaleDateString() },
  ]

  if (error) {
    return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Apprentices" description="Manage all apprentices across tenants" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Apprentices" value={stats.total} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Pending" value={stats.pending} icon={<Loader2 className="h-5 w-5" />} />
        <StatCard title="Upgraded/Completed" value={stats.upgraded} icon={<GraduationCap className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search apprentices..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
          <option value="all">All Statuses</option>
          {APPRENTICE_STATUSES.map((s) => <option key={s} value={s}>{APPRENTICE_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} onRowClick={(a) => router.push(`/app/apprentices/${a.id}`)} emptyMessage="No apprentices found" />
    </div>
  )
}

function ApprenticeStatusBadge({ status }: { status: Apprentice["status"] }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    active: "bg-green-500/20 text-green-400",
    transferred: "bg-blue-500/20 text-blue-400",
    completed: "bg-green-600/20 text-green-500",
    upgraded: "bg-purple-500/20 text-purple-400",
    suspended: "bg-red-500/20 text-red-400",
  }
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-500/20 text-gray-400"}`}>{APPRENTICE_STATUS_LABELS[status]}</span>
}
