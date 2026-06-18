import type { MarketplaceAuditLog, MarketplaceAuditAction } from "@/types"

export interface IMarketplaceAuditService {
  listAuditLogs(tenantId: string, params?: { action?: MarketplaceAuditAction; recordType?: string }): Promise<MarketplaceAuditLog[]>
  getAuditLog(id: string): Promise<MarketplaceAuditLog | null>
  logAction(data: Omit<MarketplaceAuditLog, "id" | "createdAt">): Promise<MarketplaceAuditLog>
  getPlatformAuditLogs(): Promise<MarketplaceAuditLog[]>
}
