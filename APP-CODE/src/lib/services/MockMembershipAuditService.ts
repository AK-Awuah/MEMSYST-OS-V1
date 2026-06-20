import type { IMembershipAuditService } from "./IMembershipAuditService"
import type { MembershipAuditLog } from "@/types"
import { mockMembershipAuditLogs } from "./mock-data"
import { delay } from "./shared-store"

const logs = [...mockMembershipAuditLogs]

export class MockMembershipAuditService implements IMembershipAuditService {
  async listEvents(tenantId: string, params?: { memberId?: string; action?: string }): Promise<MembershipAuditLog[]> {
    await delay(200)
    let result = logs.filter((l) => l.tenantId === tenantId)
    if (params?.memberId) result = result.filter((l) => l.memberId === params.memberId)
    if (params?.action && params.action !== "all") result = result.filter((l) => l.action === params.action)
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async recordEvent(data: Omit<MembershipAuditLog, "id" | "createdAt">): Promise<void> {
    await delay(100)
    logs.push({ ...data, id: `mal-${Date.now()}`, createdAt: new Date().toISOString() })
  }
}
