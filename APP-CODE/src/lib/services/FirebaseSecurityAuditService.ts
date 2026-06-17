import type { ISecurityAuditService } from "./ISecurityAuditService"
import type { SecurityEvent, SecurityAction, SecurityDashboardMetrics } from "@/types"

export class FirebaseSecurityAuditService implements ISecurityAuditService {
  async listEvents(_params?: { tenantId?: string; action?: SecurityAction; actorId?: string; result?: "success" | "failure"; fromDate?: string; toDate?: string }): Promise<SecurityEvent[]> { return [] }
  async recordEvent(_event: Omit<SecurityEvent, "id" | "createdAt">): Promise<void> {}
  async getDashboardMetrics(_tenantId: string): Promise<SecurityDashboardMetrics> { throw new Error("Firebase not configured") }
  async getFailedLogins(_tenantId: string, _since: string): Promise<SecurityEvent[]> { return [] }
  async getRecentActivity(_tenantId: string, _limit?: number): Promise<SecurityEvent[]> { return [] }
}
