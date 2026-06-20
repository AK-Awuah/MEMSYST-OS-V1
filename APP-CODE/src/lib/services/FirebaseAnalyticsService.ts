import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAnalyticsService } from "./IAnalyticsService"
import type { Report, ReportExecution, CustomDashboard, DashboardWidget, AnalyticsDashboardMetrics, AnalyticsAuditLog } from "@/types"

const REPORTS_COLLECTION = "reports"
const EXECUTIONS_COLLECTION = "report_executions"
const DASHBOARDS_COLLECTION = "dashboards"
const WIDGETS_COLLECTION = "dashboard_widgets"
const AUDIT_COLLECTION = "analytics_audit_logs"

function toReport(id: string, data: Record<string, unknown>): Report {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    reportType: (data.reportType as Report["reportType"]) || "custom",
    format: (data.format as Report["format"]) || "pdf",
    filters: (data.filters as Record<string, unknown>) || {},
    dateRange: data.dateRange as { start: string; end: string } | undefined,
    groupBy: (data.groupBy as string) || undefined,
    schedule: (data.schedule as Report["schedule"]) || "none",
    lastGenerated: (data.lastGenerated as string) || undefined,
    recipients: (data.recipients as string[]) || [],
    status: (data.status as Report["status"]) || "draft",
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toReportExecution(id: string, data: Record<string, unknown>): ReportExecution {
  return {
    id,
    reportId: (data.reportId as string) || "",
    tenantId: (data.tenantId as string) || "",
    executedAt: (data.executedAt as string) || "",
    completedAt: (data.completedAt as string) || undefined,
    status: (data.status as ReportExecution["status"]) || "queued",
    outputUrl: (data.outputUrl as string) || undefined,
    outputSize: (data.outputSize as number) || undefined,
    rowCount: (data.rowCount as number) || undefined,
    errorMessage: (data.errorMessage as string) || undefined,
    triggeredBy: (data.triggeredBy as "schedule" | "manual") || "manual",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toDashboard(id: string, data: Record<string, unknown>): CustomDashboard {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || undefined,
    widgets: (data.widgets as DashboardWidget[]) || [],
    isDefault: (data.isDefault as boolean) || false,
    sharedWith: (data.sharedWith as string[]) || [],
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toWidget(id: string, data: Record<string, unknown>): DashboardWidget {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    widgetType: (data.widgetType as DashboardWidget["widgetType"]) || "stat",
    dataSource: (data.dataSource as string) || "",
    position: (data.position as number) || 0,
    width: (data.width as 1 | 2 | 3) || 1,
    height: (data.height as 1 | 2) || 1,
    config: (data.config as Record<string, unknown>) || {},
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAnalyticsAuditLog(id: string, data: Record<string, unknown>): AnalyticsAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as AnalyticsAuditLog["action"]) || "report_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    details: (data.details as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseAnalyticsService implements IAnalyticsService {
  private db = getFirestoreDb()

  async listReports(tenantId: string): Promise<Report[]> {
    const col = collection(this.db, REPORTS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toReport(d.id, d.data() as Record<string, unknown>))
  }

  async getReport(id: string): Promise<Report | null> {
    const snap = await getDoc(doc(this.db, REPORTS_COLLECTION, id))
    if (!snap.exists()) return null
    return toReport(snap.id, snap.data() as Record<string, unknown>)
  }

  async createReport(data: Omit<Report, "id" | "createdAt" | "updatedAt">): Promise<Report> {
    const ref = await addDoc(collection(this.db, REPORTS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getReport(ref.id) as Promise<Report>
  }

  async updateReport(id: string, data: Partial<Report>): Promise<void> {
    await updateDoc(doc(this.db, REPORTS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async generateReport(id: string, triggeredBy: "schedule" | "manual"): Promise<ReportExecution> {
    const report = await this.getReport(id)
    if (!report) throw new Error("Report not found")
    const execution: Omit<ReportExecution, "id"> = {
      reportId: id,
      tenantId: report.tenantId,
      executedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: "completed",
      triggeredBy,
      createdAt: new Date().toISOString(),
    }
    const ref = await addDoc(collection(this.db, EXECUTIONS_COLLECTION), execution)
    await updateDoc(doc(this.db, REPORTS_COLLECTION, id), { lastGenerated: new Date().toISOString(), updatedAt: new Date().toISOString() })
    const snap = await getDoc(ref)
    return toReportExecution(snap.id, snap.data() as Record<string, unknown>)
  }

  async scheduleReport(id: string, schedule: Report["schedule"]): Promise<void> {
    await updateDoc(doc(this.db, REPORTS_COLLECTION, id), { schedule, updatedAt: new Date().toISOString() })
  }

  async listExecutions(reportId: string): Promise<ReportExecution[]> {
    const col = collection(this.db, EXECUTIONS_COLLECTION)
    const snap = await getDocs(query(col, where("reportId", "==", reportId), orderBy("executedAt", "desc")))
    return snap.docs.map((d) => toReportExecution(d.id, d.data() as Record<string, unknown>))
  }

  async listDashboards(tenantId: string): Promise<CustomDashboard[]> {
    const col = collection(this.db, DASHBOARDS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toDashboard(d.id, d.data() as Record<string, unknown>))
  }

  async getDashboard(id: string): Promise<CustomDashboard | null> {
    const snap = await getDoc(doc(this.db, DASHBOARDS_COLLECTION, id))
    if (!snap.exists()) return null
    return toDashboard(snap.id, snap.data() as Record<string, unknown>)
  }

  async createDashboard(data: Omit<CustomDashboard, "id" | "createdAt" | "updatedAt">): Promise<CustomDashboard> {
    const ref = await addDoc(collection(this.db, DASHBOARDS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getDashboard(ref.id) as Promise<CustomDashboard>
  }

  async updateDashboard(id: string, data: Partial<CustomDashboard>): Promise<void> {
    await updateDoc(doc(this.db, DASHBOARDS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async deleteDashboard(id: string): Promise<void> {
    await deleteDoc(doc(this.db, DASHBOARDS_COLLECTION, id))
  }

  async addWidget(dashboardId: string, widget: Omit<DashboardWidget, "id" | "createdAt" | "updatedAt">): Promise<DashboardWidget> {
    const col = collection(this.db, DASHBOARDS_COLLECTION, dashboardId, WIDGETS_COLLECTION)
    const ref = await addDoc(col, { ...widget, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    const snap = await getDoc(ref)
    return toWidget(snap.id, snap.data() as Record<string, unknown>)
  }

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    await deleteDoc(doc(this.db, DASHBOARDS_COLLECTION, dashboardId, WIDGETS_COLLECTION, widgetId))
  }

  async getDashboardMetrics(tenantId: string): Promise<AnalyticsDashboardMetrics> {
    const col = collection(this.db, REPORTS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    return {
      totalMembers: 0,
      activeMembers: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      pendingApprovals: 0,
      openCampaigns: 0,
      upcomingEvents: 0,
      activeListings: 0,
      memberGrowthRate: 0,
      renewalRate: 0,
    }
  }

  async getAuditLogs(tenantId: string): Promise<AnalyticsAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAnalyticsAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
