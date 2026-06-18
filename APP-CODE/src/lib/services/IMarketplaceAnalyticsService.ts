import type { MarketplaceAnalytics } from "@/types"

export interface IMarketplaceAnalyticsService {
  getAnalytics(tenantId?: string): Promise<MarketplaceAnalytics>
  getTenantAnalytics(tenantId: string): Promise<MarketplaceAnalytics>
  getPlatformAnalytics(): Promise<MarketplaceAnalytics>
}
