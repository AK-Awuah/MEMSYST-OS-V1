"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { useAuth } from "@/features/auth/AuthContext"
import {
  getLeadsService, getFormsService, getCRMService, getOrganizationService, getNotificationService, getTenantProvisioningService,
} from "@/lib/services"
import type { DashboardMetrics, Lead, FormSubmission, CRMOpportunity } from "@/types"
import { Users, FileText, TrendingUp, Target, Building2, Bell, CheckCircle, Calendar, ListChecks } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<FormSubmission[]>([])
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [leadsSvc, formsSvc, crmSvc, orgSvc, notifSvc, tenantSvc] = await Promise.all([
        getLeadsService(), getFormsService(), getCRMService(), getOrganizationService(), getNotificationService(), getTenantProvisioningService(),
      ])
      const [leads, submissions, leadStats, formsStats, opps, prospects, unread, allTenants] = await Promise.all([
        leadsSvc.listLeads(), formsSvc.listSubmissions(),
        leadsSvc.getLeadStats(), formsSvc.getSubmissionStats(),
        crmSvc.listOpportunities(), orgSvc.listProspects(),
        user ? notifSvc.getUnreadCount(user.id) : Promise.resolve(0),
        tenantSvc.listTenants(),
      ])
      const activeOpps = opps.filter((o) => !["approved", "tenant_creation"].includes(o.currentStage))
      const activeTenantCount = allTenants.filter((t) => t.commercialStatus === "active").length
      setMetrics({
        totalLeads: leadStats.total,
        newLeads: leadStats.new,
        qualifiedLeads: leadStats.qualified,
        activeOpportunities: activeOpps.length,
        meetingsScheduled: leads.filter((l) => l.status === "meeting_scheduled").length,
        proposalsSent: leads.filter((l) => l.status === "proposal_sent").length,
        wonOpportunities: leadStats.won,
        lostOpportunities: leadStats.lost,
        pendingOnboarding: prospects.filter((p) => p.status === "qualified" || p.status === "proposal_stage").length,
        activeTenants: activeTenantCount,
        newFormSubmissions: formsStats.new,
        unreadNotifications: unread,
      })
      setRecentLeads(leads.slice(0, 5))
      setRecentSubmissions(submissions.slice(0, 5))
      setOpportunities(opps)
      setLoading(false)
    }
    load()
  }, [user])

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.firstName}. Here's your operational overview.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={metrics.totalLeads} icon={<Users className="h-5 w-5" />} subtitle={`${metrics.newLeads} new this period`} />
        <StatCard title="Qualified Leads" value={metrics.qualifiedLeads} icon={<Target className="h-5 w-5" />} subtitle={`${metrics.meetingsScheduled} meetings scheduled`} />
        <StatCard title="Active Opportunities" value={metrics.activeOpportunities} icon={<TrendingUp className="h-5 w-5" />} subtitle={`${metrics.proposalsSent} proposals sent`} />
        <StatCard title="Won / Lost" value={`${metrics.wonOpportunities} / ${metrics.lostOpportunities}`} icon={<CheckCircle className="h-5 w-5" />} subtitle="Conversion rate tracking" />
        <StatCard title="Form Submissions" value={metrics.newFormSubmissions} icon={<FileText className="h-5 w-5" />} subtitle={`${metrics.newFormSubmissions} new unprocessed`} />
        <StatCard title="Pending Onboarding" value={metrics.pendingOnboarding} icon={<Building2 className="h-5 w-5" />} subtitle={`${metrics.activeTenants} active tenants`} />
        <StatCard title="Unread Notifications" value={metrics.unreadNotifications} icon={<Bell className="h-5 w-5" />} subtitle="Needs attention" />
        <StatCard title="Conversion Pipeline" value={`${metrics.activeOpportunities + metrics.wonOpportunities + metrics.lostOpportunities}`} icon={<TrendingUp className="h-5 w-5" />} subtitle="Total pipeline activity" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Leads</h3>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-gray-500">No recent leads</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{lead.organizationName}</p>
                    <p className="text-xs text-gray-500">{lead.contactPerson} · {lead.email}</p>
                  </div>
                  <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                    {lead.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Form Submissions</h3>
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-gray-500">No recent submissions</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3">
                  <div>
                    <p className="text-sm font-medium text-white capitalize">{sub.type} Request</p>
                    <p className="text-xs text-gray-500">
                      {(sub.data as Record<string, string>).email || "No email"} · {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    sub.status === "new" ? "bg-blue-500/15 text-blue-400" :
                    sub.status === "resolved" ? "bg-green-500/15 text-green-400" :
                    "bg-yellow-500/15 text-yellow-400"
                  }`}>
                    {sub.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Pipeline Overview</h3>
            <button onClick={() => router.push("/app/crm")} className="text-xs text-[#3CA4F9] hover:underline">View All</button>
          </div>
          {opportunities.length === 0 ? (
            <p className="text-sm text-gray-500">No opportunities in pipeline</p>
          ) : (
            <div className="space-y-3">
              {["new_lead", "contacted", "discovery_meeting", "needs_assessment", "proposal_sent", "negotiation", "approved", "tenant_creation"].map((stage) => {
                const count = opportunities.filter((o) => o.currentStage === stage).length
                const total = opportunities.length
                const pct = total > 0 ? (count / total) * 100 : 0
                const maxOpportunity = Math.max(...opportunities.filter((o) => o.currentStage === stage).map((o) => o.value), 0)
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-xs capitalize text-gray-400">{stage.replace(/_/g, " ")}</span>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-[#011B2B]">
                        <div
                          className="h-full rounded-full bg-[#3CA4F9] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-right text-xs text-white">{count}</span>
                    <span className="w-20 text-right text-xs text-gray-500">{maxOpportunity > 0 ? `$${maxOpportunity.toLocaleString()}` : "-"}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Upcoming Tasks</h3>
            <button onClick={() => router.push("/app/leads")} className="text-xs text-[#3CA4F9] hover:underline">View All</button>
          </div>
          {recentLeads.filter((l) => ["meeting_scheduled", "needs_assessment", "proposal_sent"].includes(l.status)).length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <ListChecks className="h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-500">No upcoming tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads
                .filter((l) => ["meeting_scheduled", "needs_assessment", "proposal_sent"].includes(l.status))
                .slice(0, 5)
                .map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => router.push(`/app/leads/${lead.id}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-3 transition-colors hover:bg-[#1e3a5f]/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3CA4F9]/10">
                      <Calendar className="h-4 w-4 text-[#3CA4F9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{lead.organizationName}</p>
                      <p className="text-xs text-gray-500">{lead.status.replace(/_/g, " ")} · {lead.contactPerson}</p>
                    </div>
                    <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                      {lead.status === "meeting_scheduled" ? "Meeting" : lead.status === "needs_assessment" ? "Assessment" : "Proposal"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
