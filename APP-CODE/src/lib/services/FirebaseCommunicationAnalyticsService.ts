import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICommunicationAnalyticsService } from "./ICommunicationAnalyticsService"
import type { CommunicationAnalytics } from "@/types"

export class FirebaseCommunicationAnalyticsService implements ICommunicationAnalyticsService {
  private db = getFirestoreDb()

  async getAnalytics(tenantId: string, filters?: { from?: string; to?: string }): Promise<CommunicationAnalytics> {
    const emailSnap = await getDocs(query(collection(this.db, "emails"), where("tenantId", "==", tenantId)))
    const smsSnap = await getDocs(query(collection(this.db, "smsMessages"), where("tenantId", "==", tenantId)))
    const pushSnap = await getDocs(query(collection(this.db, "pushNotifications"), where("tenantId", "==", tenantId)))
    const campaignSnap = await getDocs(query(collection(this.db, "campaigns"), where("tenantId", "==", tenantId)))

    const emails = emailSnap.docs.map((d) => d.data())
    const sms = smsSnap.docs.map((d) => d.data())
    const pushes = pushSnap.docs.map((d) => d.data())

    const filterByDate = (items: Record<string, unknown>[], field: string, from?: string, to?: string) => {
      if (!from && !to) return items
      return items.filter((item) => {
        const val = item[field] as string | undefined
        if (!val) return true
        const t = new Date(val).getTime()
        if (from && t < new Date(from).getTime()) return false
        if (to && t > new Date(to).getTime()) return false
        return true
      })
    }

    const filteredEmails = filterByDate(emails, "createdAt", filters?.from, filters?.to)
    const filteredSMS = filterByDate(sms, "createdAt", filters?.from, filters?.to)
    const filteredPush = filterByDate(pushes, "createdAt", filters?.from, filters?.to)

    const totalMessagesSent = filteredEmails.length + filteredSMS.length + filteredPush.length
    const totalDelivered = filteredEmails.filter((e) => e.status === "delivered").length + filteredSMS.filter((s) => s.status === "delivered").length + filteredPush.filter((p) => p.status === "delivered").length
    const totalFailed = filteredEmails.filter((e) => e.status === "failed" || e.status === "bounced").length + filteredSMS.filter((s) => s.status === "failed").length + filteredPush.filter((p) => p.status === "failed").length
    const totalOpened = filteredEmails.filter((e) => e.status === "opened" || e.status === "clicked").length
    const totalClicked = filteredEmails.filter((e) => e.status === "clicked").length

    const deliveryRate = totalMessagesSent > 0 ? (totalDelivered / totalMessagesSent) * 100 : 0
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
    const engagementRate = totalDelivered > 0 ? ((totalOpened + totalClicked) / totalDelivered) * 100 : 0

    const topCampaigns = campaignSnap.docs
      .map((d) => {
        const data = d.data()
        const s = (data.sentCount as number) || 0
        const del = (data.deliveredCount as number) || 0
        const op = (data.openedCount as number) || 0
        return { campaignId: d.id, title: (data.title as string) || "", engagementRate: del > 0 ? (op / del) * 100 : 0 }
      })
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 5)

    return {
      totalMessagesSent,
      totalMessagesDelivered: totalDelivered,
      totalMessagesFailed: totalFailed,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      engagementRate: Math.round(engagementRate * 100) / 100,
      totalCost: 0,
      totalCharge: 0,
      smsCount: filteredSMS.length,
      emailCount: filteredEmails.length,
      pushCount: filteredPush.length,
      inAppCount: 0,
      campaignCount: campaignSnap.size,
      activeCampaigns: campaignSnap.docs.filter((d) => d.data().status === "running").length,
      topCampaigns,
      dailyStats: [],
    }
  }

  async getPlatformAnalytics(filters?: { from?: string; to?: string }): Promise<CommunicationAnalytics> {
    const emailSnap = await getDocs(collection(this.db, "emails"))
    const smsSnap = await getDocs(collection(this.db, "smsMessages"))
    const pushSnap = await getDocs(collection(this.db, "pushNotifications"))
    const campaignSnap = await getDocs(collection(this.db, "campaigns"))

    const emails = emailSnap.docs.map((d) => d.data())
    const sms = smsSnap.docs.map((d) => d.data())
    const pushes = pushSnap.docs.map((d) => d.data())

    const filterByDate = (items: Record<string, unknown>[], field: string, from?: string, to?: string) => {
      if (!from && !to) return items
      return items.filter((item) => {
        const val = item[field] as string | undefined
        if (!val) return true
        const t = new Date(val).getTime()
        if (from && t < new Date(from).getTime()) return false
        if (to && t > new Date(to).getTime()) return false
        return true
      })
    }

    const filteredEmails = filterByDate(emails, "createdAt", filters?.from, filters?.to)
    const filteredSMS = filterByDate(sms, "createdAt", filters?.from, filters?.to)
    const filteredPush = filterByDate(pushes, "createdAt", filters?.from, filters?.to)

    const totalMessagesSent = filteredEmails.length + filteredSMS.length + filteredPush.length
    const totalDelivered = filteredEmails.filter((e) => e.status === "delivered").length + filteredSMS.filter((s) => s.status === "delivered").length + filteredPush.filter((p) => p.status === "delivered").length
    const totalFailed = filteredEmails.filter((e) => e.status === "failed" || e.status === "bounced").length + filteredSMS.filter((s) => s.status === "failed").length + filteredPush.filter((p) => p.status === "failed").length
    const totalOpened = filteredEmails.filter((e) => e.status === "opened" || e.status === "clicked").length
    const totalClicked = filteredEmails.filter((e) => e.status === "clicked").length

    const deliveryRate = totalMessagesSent > 0 ? (totalDelivered / totalMessagesSent) * 100 : 0
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
    const engagementRate = totalDelivered > 0 ? ((totalOpened + totalClicked) / totalDelivered) * 100 : 0

    const topCampaigns = campaignSnap.docs
      .map((d) => {
        const data = d.data()
        const s = (data.sentCount as number) || 0
        const del = (data.deliveredCount as number) || 0
        const op = (data.openedCount as number) || 0
        return { campaignId: d.id, title: (data.title as string) || "", engagementRate: del > 0 ? (op / del) * 100 : 0 }
      })
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 5)

    return {
      totalMessagesSent,
      totalMessagesDelivered: totalDelivered,
      totalMessagesFailed: totalFailed,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      engagementRate: Math.round(engagementRate * 100) / 100,
      totalCost: 0,
      totalCharge: 0,
      smsCount: filteredSMS.length,
      emailCount: filteredEmails.length,
      pushCount: filteredPush.length,
      inAppCount: 0,
      campaignCount: campaignSnap.size,
      activeCampaigns: campaignSnap.docs.filter((d) => d.data().status === "running").length,
      topCampaigns,
      dailyStats: [],
    }
  }

  async getTenantAnalytics(tenantId: string): Promise<CommunicationAnalytics> {
    return this.getAnalytics(tenantId)
  }
}
