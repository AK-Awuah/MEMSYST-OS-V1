import { delay } from "./shared-store"
import { mockEngagementEvents } from "./mock-data"
import type { EngagementEvent, EngagementMetrics } from "@/types"
import type { IEngagementService } from "./IEngagementService"

export class MockEngagementService implements IEngagementService {
  private items = [...mockEngagementEvents]

  async trackEvent(tenantId: string, data: Omit<EngagementEvent, "id" | "timestamp">): Promise<void> {
    await delay(100)
    const event: EngagementEvent = {
      ...data,
      id: `ee-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    }
    this.items.unshift(event)
  }

  async getEngagementMetrics(tenantId: string, filters?: { from?: string; to?: string }): Promise<EngagementMetrics> {
    await delay(200)
    let filtered = this.items.filter((e) => e.tenantId === tenantId)
    if (filters?.from) filtered = filtered.filter((e) => new Date(e.timestamp) >= new Date(filters.from!))
    if (filters?.to) filtered = filtered.filter((e) => new Date(e.timestamp) <= new Date(filters.to!))

    const totalSent = filtered.length
    const totalDelivered = filtered.filter((e) => e.eventType === "email_opened" || e.eventType === "communication_response").length
    const totalOpened = filtered.filter((e) => e.eventType === "email_opened").length
    const totalClicked = filtered.filter((e) => e.eventType === "link_clicked").length
    const totalRead = filtered.filter((e) => e.eventType === "notification_read").length

    return {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalRead,
      deliveryRate: totalSent > 0 ? Math.round((totalDelivered / totalSent) * 10000) / 100 : 0,
      openRate: totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 10000) / 100 : 0,
      clickRate: totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 10000) / 100 : 0,
      engagementRate: totalSent > 0 ? Math.round(((totalOpened + totalClicked) / totalSent) * 10000) / 100 : 0,
      periodStart: filters?.from || new Date(Date.now() - 30 * 86400000).toISOString(),
      periodEnd: filters?.to || new Date().toISOString(),
    }
  }

  async getUserEngagement(tenantId: string, userId: string): Promise<EngagementEvent[]> {
    await delay(200)
    return this.items
      .filter((e) => e.tenantId === tenantId && e.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  async getEngagementByCampaign(tenantId: string, campaignId: string): Promise<EngagementEvent[]> {
    await delay(200)
    return this.items
      .filter((e) => e.tenantId === tenantId && e.sourceId === campaignId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
}
