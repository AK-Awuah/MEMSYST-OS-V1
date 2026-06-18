import { delay } from "./shared-store"
import { mockCommunicationAuditLogs } from "./mock-data"
import type { CommunicationAuditLog } from "@/types"
import type { ICommunicationAuditService } from "./ICommunicationAuditService"

export class MockCommunicationAuditService implements ICommunicationAuditService {
  private items = [...mockCommunicationAuditLogs]

  async logEvent(tenantId: string, data: Omit<CommunicationAuditLog, "id" | "createdAt">): Promise<void> {
    await delay(100)
    const log: CommunicationAuditLog = {
      ...data,
      id: `caud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tenantId,
      createdAt: new Date().toISOString(),
    }
    this.items.unshift(log)
  }

  async listAuditLogs(tenantId: string, filters?: { action?: string; channel?: string; from?: string; to?: string }): Promise<CommunicationAuditLog[]> {
    await delay(200)
    let result = this.items.filter((l) => l.tenantId === tenantId)
    if (filters?.action) result = result.filter((l) => l.action === filters.action)
    if (filters?.channel) result = result.filter((l) => l.channel === filters.channel)
    if (filters?.from) result = result.filter((l) => new Date(l.createdAt) >= new Date(filters.from!))
    if (filters?.to) result = result.filter((l) => new Date(l.createdAt) <= new Date(filters.to!))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getAuditLogById(id: string): Promise<CommunicationAuditLog | null> {
    await delay(100)
    return this.items.find((l) => l.id === id) || null
  }
}
