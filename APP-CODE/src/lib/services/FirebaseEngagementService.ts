import {
  collection, addDoc, getDocs, doc, getDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IEngagementService } from "./IEngagementService"
import type { EngagementEvent, EngagementMetrics, EngagementEventType } from "@/types"

const COLLECTION = "engagementEvents"

function toEngagementEvent(id: string, data: Record<string, unknown>): EngagementEvent {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    userId: (data.userId as string) || "",
    sourceId: (data.sourceId as string) || "",
    sourceType: (data.sourceType as string) || "unknown",
    eventType: (data.eventType as EngagementEventType) || "email_opened",
    metadata: (data.metadata as Record<string, unknown>) || undefined,
    timestamp: data.timestamp instanceof Timestamp
      ? data.timestamp.toDate().toISOString()
      : (data.timestamp as string) || new Date().toISOString(),
  }
}

export class FirebaseEngagementService implements IEngagementService {
  private db = getFirestoreDb()

  async trackEvent(tenantId: string, data: Omit<EngagementEvent, "id" | "timestamp">): Promise<void> {
    const col = collection(this.db, COLLECTION)
    await addDoc(col, {
      ...data,
      tenantId,
      timestamp: new Date().toISOString(),
    })
  }

  async getEngagementMetrics(tenantId: string, filters?: { from?: string; to?: string }): Promise<EngagementMetrics> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId)]
    const snap = await getDocs(query(col, ...constraints))
    let events = snap.docs.map((d) => toEngagementEvent(d.id, d.data() as Record<string, unknown>))
    if (filters?.from) events = events.filter((e) => new Date(e.timestamp) >= new Date(filters.from!))
    if (filters?.to) events = events.filter((e) => new Date(e.timestamp) <= new Date(filters.to!))
    const totalSent = events.length
    const uniqueUsers = new Set(events.map((e) => e.userId)).size
    const byType: Record<string, number> = {}
    events.forEach((e) => {
      byType[e.eventType] = (byType[e.eventType] || 0) + 1
    })
    return {
      totalSent,
      totalDelivered: 0,
      totalOpened: byType["email_opened"] || 0,
      totalClicked: byType["link_clicked"] || 0,
      totalRead: byType["notification_read"] || 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      engagementRate: 0,
      periodStart: filters?.from || "",
      periodEnd: filters?.to || "",
    }
  }

  async getUserEngagement(tenantId: string, userId: string): Promise<EngagementEvent[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(
      query(col, where("tenantId", "==", tenantId), where("userId", "==", userId), orderBy("timestamp", "desc"))
    )
    return snap.docs.map((d) => toEngagementEvent(d.id, d.data() as Record<string, unknown>))
  }

  async getEngagementByCampaign(tenantId: string, campaignId: string): Promise<EngagementEvent[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(
      query(col, where("tenantId", "==", tenantId), where("campaignId", "==", campaignId), orderBy("timestamp", "desc"))
    )
    return snap.docs.map((d) => toEngagementEvent(d.id, d.data() as Record<string, unknown>))
  }
}
