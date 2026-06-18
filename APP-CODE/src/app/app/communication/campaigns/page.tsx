"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Plus, BarChart3, Play, CheckCircle, FileText } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import { CAMPAIGN_TYPE_LABELS, CAMPAIGN_STATUS_LABELS, CAMPAIGN_STATUSES } from "@/lib/constants"
import { StatusBadge } from "@/components/admin"
import type { Campaign, CampaignType, CampaignStatus } from "@/types"

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    tenantId: "t1",
    title: "Summer Membership Drive",
    description: "Drive new memberships for the summer season",
    type: "membership_drive",
    channel: "email",
    audience: { type: "all_members" },
    schedule: { type: "immediate" },
    status: "running",
    templateId: "tpl_1",
    createdBy: "John Doe",
    sentCount: 12450,
    deliveredCount: 11800,
    openedCount: 5200,
    clickedCount: 1800,
    failedCount: 650,
    totalCost: 1245,
    totalCharge: 1494,
    createdAt: "2026-06-01T08:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "2",
    tenantId: "t1",
    title: "Annual General Meeting Invite",
    description: "Invitation to the 2026 AGM",
    type: "event_promotion",
    channel: "sms",
    audience: { type: "all_members" },
    schedule: { type: "scheduled", scheduledAt: "2026-07-01T09:00:00Z" },
    status: "draft",
    templateId: "tpl_2",
    createdBy: "Jane Smith",
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    failedCount: 0,
    totalCost: 0,
    totalCharge: 0,
    createdAt: "2026-06-10T14:00:00Z",
    updatedAt: "2026-06-10T14:00:00Z",
  },
  {
    id: "3",
    tenantId: "t1",
    title: "Renewal Reminder Q3",
    description: "Remind members about upcoming renewals",
    type: "renewal_campaign",
    channel: "email",
    audience: { type: "specific_categories" },
    schedule: { type: "scheduled", scheduledAt: "2026-07-15T10:00:00Z" },
    status: "scheduled",
    templateId: "tpl_3",
    createdBy: "John Doe",
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    failedCount: 0,
    totalCost: 0,
    totalCharge: 0,
    createdAt: "2026-06-12T11:00:00Z",
    updatedAt: "2026-06-12T11:00:00Z",
  },
  {
    id: "4",
    tenantId: "t1",
    title: "New Training Program Launch",
    description: "Announce the new leadership training program",
    type: "training_campaign",
    channel: "push",
    audience: { type: "all_apprentices" },
    schedule: { type: "immediate" },
    status: "completed",
    templateId: "tpl_4",
    createdBy: "Alice Brown",
    sentCount: 3200,
    deliveredCount: 3100,
    openedCount: 2100,
    clickedCount: 950,
    failedCount: 100,
    totalCost: 320,
    totalCharge: 384,
    createdAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-05-25T10:00:00Z",
  },
  {
    id: "5",
    tenantId: "t1",
    title: "New Policy Announcement",
    description: "Communicate updated membership policies",
    type: "announcement",
    channel: "in_app",
    audience: { type: "all_members" },
    schedule: { type: "immediate" },
    status: "completed",
    templateId: "tpl_5",
    createdBy: "Jane Smith",
    sentCount: 15000,
    deliveredCount: 14800,
    openedCount: 9800,
    clickedCount: 3200,
    failedCount: 200,
    totalCost: 0,
    totalCharge: 0,
    createdAt: "2026-04-15T09:00:00Z",
    updatedAt: "2026-04-16T09:00:00Z",
  },
  {
    id: "6",
    tenantId: "t1",
    title: "Awareness Campaign Q2",
    description: "General awareness campaign for Q2",
    type: "awareness",
    channel: "email",
    audience: { type: "all_members" },
    schedule: { type: "immediate" },
    status: "cancelled",
    templateId: "tpl_6",
    createdBy: "John Doe",
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    failedCount: 0,
    totalCost: 0,
    totalCharge: 0,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-05T08:00:00Z",
  },
]

export default function CampaignsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const stats = useMemo(() => ({
    total: mockCampaigns.length,
    running: mockCampaigns.filter((c) => c.status === "running").length,
    completed: mockCampaigns.filter((c) => c.status === "completed").length,
    draft: mockCampaigns.filter((c) => c.status === "draft").length,
  }), [])

  const filtered = useMemo(() => {
    let result = mockCampaigns
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((c) => c.title.toLowerCase().includes(s))
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }
    return result
  }, [search, statusFilter])

  const columns: Column<Campaign>[] = [
    {
      key: "title",
      header: "Title",
      render: (c) => <span className="font-medium text-white">{c.title}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (c) => (
        <span className="text-sm text-gray-300">
          {CAMPAIGN_TYPE_LABELS[c.type as CampaignType]}
        </span>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      render: (c) => (
        <span className="text-sm capitalize text-gray-400">{c.channel}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "sentCount",
      header: "Sent",
      render: (c) => (
        <span className="text-sm text-gray-300">{c.sentCount.toLocaleString()}</span>
      ),
    },
    {
      key: "deliveredCount",
      header: "Delivered",
      render: (c) => (
        <span className="text-sm text-gray-300">{c.deliveredCount.toLocaleString()}</span>
      ),
    },
    {
      key: "openedCount",
      header: "Opened",
      render: (c) => (
        <span className="text-sm text-gray-300">{c.openedCount.toLocaleString()}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (c) => (
        <span className="text-sm text-gray-400">
          {new Date(c.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        actions={
          <Link
            href="/app/communication/campaigns/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Campaigns"
          value={stats.total}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="Running"
          value={stats.running}
          icon={<Play className="h-5 w-5" />}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Draft"
          value={stats.draft}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search campaigns by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {CAMPAIGN_STATUSES.map((s) => (
            <option key={s} value={s}>
              {CAMPAIGN_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(c) => router.push(`/app/communication/campaigns/${c.id}`)}
        emptyMessage="No campaigns found."
      />
    </div>
  )
}
