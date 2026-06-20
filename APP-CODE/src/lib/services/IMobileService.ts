import type { PWAConfig, OfflineCacheRule, MobileAppVersion, MobileAuditLog } from "@/types"

export interface IMobileService {
  getPWAConfig(tenantId: string): Promise<PWAConfig | null>
  updatePWAConfig(tenantId: string, data: Partial<PWAConfig>): Promise<PWAConfig>
  buildPWA(tenantId: string): Promise<PWAConfig>
  listCacheRules(tenantId: string): Promise<OfflineCacheRule[]>
  getCacheRule(id: string): Promise<OfflineCacheRule | null>
  createCacheRule(tenantId: string, data: Omit<OfflineCacheRule, "id" | "createdAt" | "updatedAt">): Promise<OfflineCacheRule>
  updateCacheRule(id: string, data: Partial<OfflineCacheRule>): Promise<void>
  listVersions(tenantId: string): Promise<MobileAppVersion[]>
  getVersion(id: string): Promise<MobileAppVersion | null>
  createVersion(tenantId: string, data: Omit<MobileAppVersion, "id" | "createdAt">): Promise<MobileAppVersion>
  deprecateVersion(id: string): Promise<void>
  getAuditLogs(tenantId: string): Promise<MobileAuditLog[]>
}
