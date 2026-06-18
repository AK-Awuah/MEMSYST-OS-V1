import { delay } from "./shared-store"
import { mockEmailMessages, mockSMSMessages, mockPushNotifications, mockCampaigns } from "./mock-data"
import type { CommunicationAnalytics } from "@/types"
import type { ICommunicationAnalyticsService } from "./ICommunicationAnalyticsService"

export class MockCommunicationAnalyticsService implements ICommunicationAnalyticsService {
  private emails = [...mockEmailMessages]
  private sms = [...mockSMSMessages]
  private pushes = [...mockPushNotifications]
  private campaigns = [...mockCampaigns]

  async getAnalytics(tenantId: string, filters?: { from?: string; to?: string }): Promise<CommunicationAnalytics> {
    await delay(300)
    const allEmails = this.emails.filter((e) => e.tenantId === tenantId)
    const allSMS = this.sms.filter((s) => s.tenantId === tenantId)
    const allPush = this.pushes.filter((p) => p.tenantId === tenantId)
    const allCampaigns = this.campaigns.filter((c) => c.tenantId === tenantId)

    const totalMessagesSent = allEmails.length + allSMS.length + allPush.length
    const totalMessagesDelivered = allEmails.filter((e) => e.status === "delivered").length + allSMS.filter((s) => s.status === "delivered").length + allPush.filter((p) => p.status === "delivered").length
    const totalMessagesFailed = allEmails.filter((e) => e.status === "failed").length + allSMS.filter((s) => s.status === "failed").length
    const totalOpened = allEmails.filter((e) => e.openedAt).length
    const totalClicked = 0

    const totalCost = [...allEmails, ...allSMS, ...allPush].reduce((sum, m) => sum + (m as any).cost || 0, 0)
    const totalCharge = [...allEmails, ...allSMS, ...allPush].reduce((sum, m) => sum + (m as any).totalCharge || 0, 0)

    return {
      totalMessagesSent,
      totalMessagesDelivered,
      totalMessagesFailed,
      deliveryRate: totalMessagesSent > 0 ? Math.round((totalMessagesDelivered / totalMessagesSent) * 10000) / 100 : 0,
      openRate: totalMessagesDelivered > 0 ? Math.round((totalOpened / totalMessagesDelivered) * 10000) / 100 : 0,
      clickRate: totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 10000) / 100 : 0,
      engagementRate: totalMessagesSent > 0 ? Math.round(((totalOpened + totalClicked) / totalMessagesSent) * 10000) / 100 : 0,
      totalCost,
      totalCharge,
      smsCount: allSMS.length,
      emailCount: allEmails.length,
      pushCount: allPush.length,
      inAppCount: 0,
      campaignCount: allCampaigns.length,
      activeCampaigns: allCampaigns.filter((c) => c.status === "running").length,
      topCampaigns: allCampaigns.filter((c) => c.deliveredCount > 0 && c.openedCount > 0).slice(0, 5).map((c) => ({
        campaignId: c.id,
        title: c.title,
        engagementRate: c.deliveredCount > 0 ? Math.round((c.openedCount / c.deliveredCount) * 10000) / 100 : 0,
      })),
      dailyStats: this.generateDailyStats(allEmails, allSMS),
    }
  }

  async getPlatformAnalytics(filters?: { from?: string; to?: string }): Promise<CommunicationAnalytics> {
    await delay(300)
    return this.getAnalytics("", filters)
  }

  async getTenantAnalytics(tenantId: string): Promise<CommunicationAnalytics> {
    await delay(200)
    return this.getAnalytics(tenantId)
  }

  private generateDailyStats(emails: typeof mockEmailMessages, smsMessages: typeof mockSMSMessages): { date: string; sent: number; delivered: number; opened: number }[] {
    const stats: Record<string, { sent: number; delivered: number; opened: number }> = {}
    const all = [...emails, ...smsMessages]
    for (const item of all) {
      const date = (item.createdAt || "").split("T")[0]
      if (!date) continue
      if (!stats[date]) stats[date] = { sent: 0, delivered: 0, opened: 0 }
      stats[date].sent++
      if (item.status === "delivered") stats[date].delivered++
      if ("openedAt" in item && item.openedAt) stats[date].opened++
    }
    return Object.entries(stats).map(([date, data]) => ({ date, ...data }))
  }
}
