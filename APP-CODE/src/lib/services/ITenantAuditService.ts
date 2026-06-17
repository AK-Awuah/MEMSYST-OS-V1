import type { TenantAuditLog } from "@/types"

export interface ITenantAuditService {
  listEvents(tenantId: string, params?: { module?: string; action?: string }): Promise<TenantAuditLog[]>
  recordEvent(data: Omit<TenantAuditLog, "id" | "createdAt">): Promise<void>
}
