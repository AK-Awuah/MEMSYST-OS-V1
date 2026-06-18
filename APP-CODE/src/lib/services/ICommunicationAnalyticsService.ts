import type { CommunicationAnalytics } from "@/types"

export interface ICommunicationAnalyticsService {
  getAnalytics(tenantId: string, filters?: { from?: string; to?: string }): Promise<CommunicationAnalytics>
  getPlatformAnalytics(filters?: { from?: string; to?: string }): Promise<CommunicationAnalytics>
  getTenantAnalytics(tenantId: string): Promise<CommunicationAnalytics>
}
