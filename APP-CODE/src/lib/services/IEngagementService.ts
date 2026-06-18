import type { EngagementEvent, EngagementMetrics } from "@/types"

export interface IEngagementService {
  trackEvent(tenantId: string, data: Omit<EngagementEvent, "id" | "timestamp">): Promise<void>
  getEngagementMetrics(tenantId: string, filters?: { from?: string; to?: string }): Promise<EngagementMetrics>
  getUserEngagement(tenantId: string, userId: string): Promise<EngagementEvent[]>
  getEngagementByCampaign(tenantId: string, campaignId: string): Promise<EngagementEvent[]>
}
