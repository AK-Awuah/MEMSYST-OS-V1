import type { SecurityEvent, SecurityAction, SecurityDashboardMetrics } from "@/types"

export interface ISecurityAuditService {
  listEvents(params?: {
    tenantId?: string
    action?: SecurityAction
    actorId?: string
    result?: "success" | "failure"
    fromDate?: string
    toDate?: string
  }): Promise<SecurityEvent[]>
  recordEvent(event: Omit<SecurityEvent, "id" | "createdAt">): Promise<void>
  getDashboardMetrics(tenantId: string): Promise<SecurityDashboardMetrics>
  getFailedLogins(tenantId: string, since: string): Promise<SecurityEvent[]>
  getRecentActivity(tenantId: string, limit?: number): Promise<SecurityEvent[]>
}
