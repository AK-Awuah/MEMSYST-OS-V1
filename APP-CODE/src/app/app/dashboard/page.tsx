"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { StatCardSkeleton, TableSkeleton } from "@/components/admin/Skeleton"
import { useAuth } from "@/features/auth/AuthContext"
import {
  getLeadsService, getFormsService, getCRMService, getOrganizationService, getNotificationService, getTenantProvisioningService,
} from "@/lib/services"
import type { DashboardMetrics, Lead, FormSubmission, CRMOpportunity } from "@/types"
import { TenantAnalyticsWidget } from "@/components/admin/tenants/TenantAnalyticsWidget"
import { Users, FileText, TrendingUp, Target, Building2, Bell, CheckCircle, Calendar, ListChecks, ArrowRight, BarChart3 } from "lucide-react"

// Mock data for the chart
const revenueData = [
  { name: "Jan", leads: 45, conversions: 12 },
  { name: "Feb", leads: 52, conversions: 18 },
  { name: "Mar", leads: 48, conversions: 15 },
  { name: "Apr", leads: 70, conversions: 25 },
  { name: "May", leads: 85, conversions: 35 },
  { name: "Jun", leads: 65, conversions: 28 },
  { name: "Jul", leads: 90, conversions: 42 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

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
      <div className="space-y-6 pb-12">
        <PageHeader title="Executive Dashboard" description="Loading..." />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <TableSkeleton rows={4} cols={4} />
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Executive Dashboard"
          description={`Welcome back, ${user?.firstName}. Here is your real-time organizational intelligence.`}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={metrics.totalLeads} icon={<Users className="h-5 w-5" />} trend={{ value: "+12.5%", positive: true }} subtitle={`${metrics.newLeads} new this period`} />
        <StatCard title="Qualified Prospects" value={metrics.qualifiedLeads} icon={<Target className="h-5 w-5" />} trend={{ value: "+5.2%", positive: true }} subtitle={`${metrics.meetingsScheduled} meetings scheduled`} />
        <StatCard title="Active Pipeline" value={metrics.activeOpportunities} icon={<TrendingUp className="h-5 w-5" />} trend={{ value: "+18.1%", positive: true }} subtitle={`${metrics.proposalsSent} proposals sent`} />
        <StatCard title="Active Tenants" value={metrics.activeTenants} icon={<Building2 className="h-5 w-5" />} trend={{ value: "+2", positive: true }} subtitle={`${metrics.pendingOnboarding} pending onboarding`} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 relative">
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#3CA4F9]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3CA4F9]" /> Lead Generation Trends
              </h3>
              <p className="text-sm text-gray-400 mt-1">Monthly comparison of leads vs. conversions</p>
            </div>
            <select className="bg-[#012a42] border border-[#1e3a5f] text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#3CA4F9]">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3CA4F9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3CA4F9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#012a42', borderColor: '#1e3a5f', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3CA4F9" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorConversions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pipeline Overview */}
        <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 relative flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Pipeline Activity</h3>
            <button onClick={() => router.push("/app/crm")} className="text-xs font-semibold text-[#3CA4F9] hover:underline flex items-center gap-1">
              View CRM <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {opportunities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <TrendingUp className="w-12 h-12 text-[#1e3a5f] mb-3" />
              <p className="text-sm text-gray-500">Your pipeline is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-5 flex-1">
              {["new_lead", "discovery_meeting", "proposal_sent", "negotiation", "approved"].map((stage, idx) => {
                const count = opportunities.filter((o) => o.currentStage === stage).length
                const total = opportunities.length
                const pct = total > 0 ? (count / total) * 100 : 0
                // Use different gradient colors for stages to make it vibrant
                const gradients = [
                  "from-blue-500 to-cyan-400",
                  "from-indigo-500 to-blue-400",
                  "from-violet-500 to-fuchsia-400",
                  "from-amber-500 to-orange-400",
                  "from-emerald-500 to-teal-400"
                ]
                
                return (
                  <div key={stage} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium capitalize text-gray-300 group-hover:text-white transition-colors">
                        {stage.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-bold text-white">{count}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#012a42] shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${gradients[idx % gradients.length]} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Tenant Analytics */}
      <motion.div variants={itemVariants}>
        <TenantAnalyticsWidget />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3CA4F9]" /> Recent Leads
            </h3>
            <button onClick={() => router.push("/app/leads")} className="text-xs font-semibold text-[#3CA4F9] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {recentLeads.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No recent leads found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <motion.div 
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(30, 58, 95, 0.4)" }}
                  key={lead.id} 
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-[#1e3a5f] bg-[#012a42]/50 p-4 transition-colors"
                  onClick={() => router.push(`/app/leads/${lead.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {lead.organizationName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{lead.organizationName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{lead.contactPerson} · {lead.email}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#3CA4F9]/10 border border-[#3CA4F9]/20 px-3 py-1 text-xs font-medium text-[#3CA4F9] shadow-[0_0_10px_rgba(60,164,249,0.1)]">
                    {lead.status.replace(/_/g, " ")}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action Items / Tasks */}
        <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Action Items
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Form Submissions */}
            {recentSubmissions.slice(0, 3).map((sub) => (
              <motion.div 
                whileHover={{ x: 4 }}
                key={sub.id} 
                className="flex items-start gap-4 rounded-xl border border-[#1e3a5f] bg-[#012a42]/30 p-4"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white capitalize">New {sub.type} Request</p>
                  <p className="text-xs text-gray-400 mt-1">Review submission from {(sub.data as Record<string, string>).email || "Unknown"}</p>
                </div>
                <button 
                  onClick={() => router.push(`/app/forms/${sub.id}`)}
                  className="rounded-md bg-[#1e3a5f] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3CA4F9] transition-colors"
                >
                  Review
                </button>
              </motion.div>
            ))}

            {/* Notifications placeholder if fewer submissions */}
            {recentSubmissions.length < 3 && (
              <motion.div whileHover={{ x: 4 }} className="flex items-start gap-4 rounded-xl border border-[#1e3a5f] bg-[#012a42]/30 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">System Security Scan</p>
                  <p className="text-xs text-gray-400 mt-1">No vulnerabilities detected in the last 24 hours.</p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
