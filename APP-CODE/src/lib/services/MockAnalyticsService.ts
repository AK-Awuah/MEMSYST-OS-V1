import type { IAnalyticsService } from "./IAnalyticsService"
import type { Report, ReportExecution, CustomDashboard, DashboardWidget, AnalyticsDashboardMetrics, AnalyticsAuditLog } from "@/types"
import { delay } from "./shared-store"

let reports: Report[] = [
  {
    id: "rpt-1",
    tenantId: "tenant-1",
    title: "Monthly Membership Report",
    description: "Overview of membership metrics",
    reportType: "membership",
    format: "pdf",
    filters: {},
    schedule: "monthly",
    lastGenerated: new Date().toISOString(),
    recipients: ["admin@test.com"],
    status: "active",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let executions: ReportExecution[] = [
  {
    id: "exec-1",
    reportId: "rpt-1",
    tenantId: "tenant-1",
    executedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: "completed",
    outputUrl: "https://example.com/report.pdf",
    outputSize: 1024,
    rowCount: 100,
    triggeredBy: "manual",
    createdAt: new Date().toISOString(),
  },
]

let dashboards: CustomDashboard[] = [
  {
    id: "db-1",
    tenantId: "tenant-1",
    name: "Main Dashboard",
    description: "Key metrics at a glance",
    widgets: [],
    isDefault: true,
    sharedWith: [],
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let widgets: DashboardWidget[] = [
  {
    id: "wgt-1",
    tenantId: "tenant-1",
    title: "Total Members",
    widgetType: "stat",
    dataSource: "members",
    position: 1,
    width: 1,
    height: 1,
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextReportId = reports.length + 1
let nextExecId = executions.length + 1
let nextDashboardId = dashboards.length + 1
let nextWidgetId = widgets.length + 1

export class MockAnalyticsService implements IAnalyticsService {
  async listReports(tenantId: string): Promise<Report[]> {
    await delay(150)
    return reports.filter((r) => r.tenantId === tenantId)
  }

  async getReport(id: string): Promise<Report | null> {
    await delay(100)
    return reports.find((r) => r.id === id) || null
  }

  async createReport(data: Omit<Report, "id" | "createdAt" | "updatedAt">): Promise<Report> {
    await delay(200)
    const report: Report = { ...data, id: `rpt-${nextReportId++}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    reports.push(report)
    return report
  }

  async updateReport(id: string, data: Partial<Report>): Promise<void> {
    await delay(150)
    const idx = reports.findIndex((r) => r.id === id)
    if (idx !== -1) reports[idx] = { ...reports[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async generateReport(id: string, triggeredBy: "schedule" | "manual"): Promise<ReportExecution> {
    await delay(300)
    const report = reports.find((r) => r.id === id)
    if (!report) throw new Error("Report not found")
    const execution: ReportExecution = {
      id: `exec-${nextExecId++}`,
      reportId: id,
      tenantId: report.tenantId,
      executedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: "completed",
      triggeredBy,
      createdAt: new Date().toISOString(),
    }
    executions.push(execution)
    report.lastGenerated = execution.executedAt
    return execution
  }

  async scheduleReport(id: string, schedule: Report["schedule"]): Promise<void> {
    await delay(100)
    const idx = reports.findIndex((r) => r.id === id)
    if (idx !== -1) reports[idx] = { ...reports[idx], schedule, updatedAt: new Date().toISOString() }
  }

  async listExecutions(reportId: string): Promise<ReportExecution[]> {
    await delay(100)
    return executions.filter((e) => e.reportId === reportId)
  }

  async listDashboards(tenantId: string): Promise<CustomDashboard[]> {
    await delay(150)
    return dashboards.filter((d) => d.tenantId === tenantId)
  }

  async getDashboard(id: string): Promise<CustomDashboard | null> {
    await delay(100)
    return dashboards.find((d) => d.id === id) || null
  }

  async createDashboard(data: Omit<CustomDashboard, "id" | "createdAt" | "updatedAt">): Promise<CustomDashboard> {
    await delay(200)
    const dashboard: CustomDashboard = {
      ...data,
      id: `db-${nextDashboardId++}`,
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dashboards.push(dashboard)
    return dashboard
  }

  async updateDashboard(id: string, data: Partial<CustomDashboard>): Promise<void> {
    await delay(150)
    const idx = dashboards.findIndex((d) => d.id === id)
    if (idx !== -1) dashboards[idx] = { ...dashboards[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async deleteDashboard(id: string): Promise<void> {
    await delay(100)
    dashboards = dashboards.filter((d) => d.id !== id)
    widgets = widgets.filter((w) => w.id !== id)
  }

  async addWidget(dashboardId: string, widget: Omit<DashboardWidget, "id" | "createdAt" | "updatedAt">): Promise<DashboardWidget> {
    await delay(150)
    const newWidget: DashboardWidget = {
      ...widget,
      id: `wgt-${nextWidgetId++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    widgets.push(newWidget)
    const dbIdx = dashboards.findIndex((d) => d.id === dashboardId)
    if (dbIdx !== -1) dashboards[dbIdx].widgets.push(newWidget)
    return newWidget
  }

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    await delay(100)
    widgets = widgets.filter((w) => w.id !== widgetId)
    const dbIdx = dashboards.findIndex((d) => d.id === dashboardId)
    if (dbIdx !== -1) dashboards[dbIdx].widgets = dashboards[dbIdx].widgets.filter((w) => w.id !== widgetId)
  }

  async getDashboardMetrics(tenantId: string): Promise<AnalyticsDashboardMetrics> {
    await delay(100)
    return {
      totalMembers: 1250,
      activeMembers: 980,
      totalRevenue: 450000,
      monthlyRevenue: 37500,
      pendingApprovals: 23,
      openCampaigns: 5,
      upcomingEvents: 12,
      activeListings: 48,
      memberGrowthRate: 8.5,
      renewalRate: 92.3,
    }
  }

  async getAuditLogs(tenantId: string): Promise<AnalyticsAuditLog[]> {
    await delay(100)
    return [
      {
        id: "al-1",
        tenantId,
        actor: "user-1",
        action: "report_generated",
        recordType: "report",
        recordId: "rpt-1",
        details: "Generated monthly membership report",
        createdAt: new Date().toISOString(),
      },
    ]
  }
}
