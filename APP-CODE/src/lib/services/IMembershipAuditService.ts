import type { MembershipAuditLog } from "@/types"

export interface IMembershipAuditService {
  listEvents(tenantId: string, params?: { memberId?: string; action?: string }): Promise<MembershipAuditLog[]>
  recordEvent(data: Omit<MembershipAuditLog, "id" | "createdAt">): Promise<void>
}
