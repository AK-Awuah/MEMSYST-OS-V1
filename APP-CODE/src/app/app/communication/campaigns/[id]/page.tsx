"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, Ban, Users, Target, Activity, BarChart3 } from "lucide-react"
import { PageHeader, StatCard, StatusBadge } from "@/components/admin"
import { CAMPAIGN_TYPE_LABELS, NOTIFICATION_CHANNEL_LABELS, CAMPAIGN_STATUS_LABELS } from "@/lib/constants"
import type { Campaign, CampaignType, NotificationChannel, CampaignStatus } from "@/types"

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

const audienceTypeLabels: Record<string, string> = {
  all_members: "All Members",
  all_apprentices: "All Apprentices",
  all_executives: "All Executives",
  all_branches: "All Branches",
  all_regions: "All Regions",
  specific_categories: "Specific Categories",
  specific_membership_types: "Specific Membership Types",
  segment: "Segment",
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [campaign] = useState<Campaign | undefined>(
    () => mockCampaigns.find((c) => c.id === id)
  )

  const stats = useMemo(() => {
    if (!campaign) return null
    const { sentCount, deliveredCount, openedCount, clickedCount, failedCount } = campaign
    return {
      sentCount,
      deliveredCount,
      openedCount,
      clickedCount,
      failedCount,
      deliveryRate: sentCount > 0 ? ((deliveredCount / sentCount) * 100).toFixed(1) : "0.0",
      openRate: deliveredCount > 0 ? ((openedCount / deliveredCount) * 100).toFixed(1) : "0.0",
      clickRate: openedCount > 0 ? ((clickedCount / openedCount) * 100).toFixed(1) : "0.0",
      failRate: sentCount > 0 ? ((failedCount / sentCount) * 100).toFixed(1) : "0.0",
    }
  }, [campaign])

  if (!campaign || !stats) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <p>Campaign not found</p>
        <button onClick={() => router.back()} className="mt-2 text-sm underline">
          Go back
        </button>
      </div>
    )
  }

  const canLaunch = campaign.status === "draft" || campaign.status === "scheduled"
  const canCancel = campaign.status === "running" || campaign.status === "scheduled"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Campaigns
      </button>

      <PageHeader
        title={campaign.title}
        description={campaign.description}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Sent"
          value={stats.sentCount.toLocaleString()}
          icon={<Send className="h-5 w-5" />}
        />
        <StatCard
          title="Delivered"
          value={stats.deliveredCount.toLocaleString()}
          subtitle={`${stats.deliveryRate}% delivery rate`}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          title="Opened"
          value={stats.openedCount.toLocaleString()}
          subtitle={`${stats.openRate}% open rate`}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Clicked"
          value={stats.clickedCount.toLocaleString()}
          subtitle={`${stats.clickRate}% click rate`}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Campaign Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-medium text-white mt-1">
                  {CAMPAIGN_TYPE_LABELS[campaign.type as CampaignType]}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Channel</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">
                  {NOTIFICATION_CHANNEL_LABELS[campaign.channel as NotificationChannel]}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1">
                  <StatusBadge status={campaign.status} />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Schedule</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">
                  {campaign.schedule.type === "scheduled"
                    ? new Date(campaign.schedule.scheduledAt!).toLocaleString()
                    : "Immediate"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Audience</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Audience Type</p>
                <p className="text-sm font-medium text-white mt-1">
                  {audienceTypeLabels[campaign.audience.type] || campaign.audience.type}
                </p>
              </div>
              {campaign.audience.segmentId && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500">Segment</p>
                  <p className="text-sm font-medium text-white mt-1">{campaign.audience.segmentId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sent</span>
                <span className="text-white font-medium">{stats.sentCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivered</span>
                <span className="text-emerald-400 font-medium">{stats.deliveredCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Opened</span>
                <span className="text-blue-400 font-medium">{stats.openedCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Clicked</span>
                <span className="text-purple-400 font-medium">{stats.clickedCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Failed</span>
                <span className="text-red-400 font-medium">{stats.failedCount.toLocaleString()}</span>
              </div>
              <hr className="border-[#1e3a5f]" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Rate</span>
                <span className="text-white font-medium">{stats.deliveryRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Open Rate</span>
                <span className="text-white font-medium">{stats.openRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Click Rate</span>
                <span className="text-white font-medium">{stats.clickRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fail Rate</span>
                <span className="text-red-400 font-medium">{stats.failRate}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {canLaunch && (
                <button
                  onClick={() => alert("Campaign launched (no-op)")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-sm text-white hover:bg-emerald-500 transition-colors"
                >
                  <Send className="h-4 w-4" /> Launch Campaign
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => alert("Campaign cancelled (no-op)")}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors"
                >
                  <Ban className="h-4 w-4" /> Cancel Campaign
                </button>
              )}
              {!canLaunch && !canCancel && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No actions available for {CAMPAIGN_STATUS_LABELS[campaign.status as CampaignStatus]} campaigns.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
