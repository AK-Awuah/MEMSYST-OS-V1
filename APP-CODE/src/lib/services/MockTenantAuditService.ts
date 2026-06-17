import type { ITenantAuditService } from "./ITenantAuditService"
import type { TenantAuditLog } from "@/types"
import { mockTenantAuditLogs } from "./mock-data"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
let logs = [...mockTenantAuditLogs]

export class MockTenantAuditService implements ITenantAuditService {
  async listEvents(tenantId: string, params?: { module?: string; action?: string }): Promise<TenantAuditLog[]> {
    await delay(200)
    let filtered = logs.filter((l) => l.tenantId === tenantId)
    if (params?.module) filtered = filtered.filter((l) => l.module === params.module)
    if (params?.action) filtered = filtered.filter((l) => l.action === params.action)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async recordEvent(data: Omit<TenantAuditLog, "id" | "createdAt">): Promise<void> {
    await delay(100)
    logs.unshift({ ...data, id: `tal-${Date.now()}`, createdAt: new Date().toISOString() })
  }
}
