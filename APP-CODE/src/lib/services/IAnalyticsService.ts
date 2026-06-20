import type { Report, ReportExecution, CustomDashboard, DashboardWidget, AnalyticsDashboardMetrics, AnalyticsAuditLog } from "@/types"

export interface IAnalyticsService {
  listReports(tenantId: string): Promise<Report[]>
  getReport(id: string): Promise<Report | null>
  createReport(data: Omit<Report, "id" | "createdAt" | "updatedAt">): Promise<Report>
  updateReport(id: string, data: Partial<Report>): Promise<void>
  generateReport(id: string, triggeredBy: "schedule" | "manual"): Promise<ReportExecution>
  scheduleReport(id: string, schedule: Report["schedule"]): Promise<void>
  listExecutions(reportId: string): Promise<ReportExecution[]>

  listDashboards(tenantId: string): Promise<CustomDashboard[]>
  getDashboard(id: string): Promise<CustomDashboard | null>
  createDashboard(data: Omit<CustomDashboard, "id" | "createdAt" | "updatedAt">): Promise<CustomDashboard>
  updateDashboard(id: string, data: Partial<CustomDashboard>): Promise<void>
  deleteDashboard(id: string): Promise<void>
  addWidget(dashboardId: string, widget: Omit<DashboardWidget, "id" | "createdAt" | "updatedAt">): Promise<DashboardWidget>
  removeWidget(dashboardId: string, widgetId: string): Promise<void>

  getDashboardMetrics(tenantId: string): Promise<AnalyticsDashboardMetrics>
  getAuditLogs(tenantId: string): Promise<AnalyticsAuditLog[]>
}
