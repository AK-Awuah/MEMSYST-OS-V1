import type { IMarketplaceAuditService } from "./IMarketplaceAuditService"
import type { MarketplaceAuditLog, MarketplaceAuditAction } from "@/types"
import { mockMarketplaceAuditLogs } from "./mock-data"
import { delay } from "./shared-store"

export class MockMarketplaceAuditService implements IMarketplaceAuditService {
  private items = [...mockMarketplaceAuditLogs]

  async listAuditLogs(tenantId: string, params?: { action?: MarketplaceAuditAction; recordType?: string }): Promise<MarketplaceAuditLog[]> {
    await delay(200)
    let result = this.items.filter((l) => l.tenantId === tenantId)
    if (params?.action) result = result.filter((l) => l.action === params.action)
    if (params?.recordType) result = result.filter((l) => l.recordType === params.recordType)
    return result
  }

  async getAuditLog(id: string): Promise<MarketplaceAuditLog | null> {
    await delay(100)
    return this.items.find((l) => l.id === id) || null
  }

  async logAction(data: Omit<MarketplaceAuditLog, "id" | "createdAt">): Promise<MarketplaceAuditLog> {
    await delay(150)
    const log: MarketplaceAuditLog = {
      ...data,
      id: `mal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.items.unshift(log)
    return log
  }

  async getPlatformAuditLogs(): Promise<MarketplaceAuditLog[]> {
    await delay(100)
    return [...this.items]
  }
}
