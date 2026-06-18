import type { CommunicationAuditLog } from "@/types"

export interface ICommunicationAuditService {
  logEvent(tenantId: string, data: Omit<CommunicationAuditLog, "id" | "createdAt">): Promise<void>
  listAuditLogs(tenantId: string, filters?: { action?: string; channel?: string; from?: string; to?: string }): Promise<CommunicationAuditLog[]>
  getAuditLogById(id: string): Promise<CommunicationAuditLog | null>
}
