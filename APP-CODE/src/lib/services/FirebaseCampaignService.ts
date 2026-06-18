import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICampaignService } from "./ICampaignService"
import type { Campaign, CampaignType, CampaignStatus, NotificationChannel, CampaignAudience, CampaignSchedule } from "@/types"

const COLLECTION = "campaigns"

function toCampaign(id: string, data: Record<string, unknown>): Campaign {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    type: (data.type as CampaignType) || "other",
    channel: (data.channel as NotificationChannel) || "email",
    audience: (data.audience as CampaignAudience) || { type: "all_members" },
    schedule: (data.schedule as CampaignSchedule) || { type: "immediate" },
    status: (data.status as CampaignStatus) || "draft",
    templateId: data.templateId as string | undefined,
    createdBy: (data.createdBy as string) || "",
    sentCount: (data.sentCount as number) || 0,
    deliveredCount: (data.deliveredCount as number) || 0,
    openedCount: (data.openedCount as number) || 0,
    clickedCount: (data.clickedCount as number) || 0,
    failedCount: (data.failedCount as number) || 0,
    totalCost: (data.totalCost as number) || 0,
    totalCharge: (data.totalCharge as number) || 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseCampaignService implements ICampaignService {
  private db = getFirestoreDb()

  async createCampaign(tenantId: string, data: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "sentCount" | "deliveredCount" | "openedCount" | "clickedCount" | "failedCount" | "totalCost" | "totalCharge">): Promise<Campaign> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      ...data,
      tenantId,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      failedCount: 0,
      totalCost: 0,
      totalCharge: 0,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async updateCampaign(tenantId: string, id: string, data: Partial<Campaign>): Promise<Campaign> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Campaign ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { ...data, updatedAt: now })
    const updated = await getDoc(ref)
    return toCampaign(updated.id, updated.data() as Record<string, unknown>)
  }

  async launchCampaign(tenantId: string, id: string): Promise<Campaign> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Campaign ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { status: "running", updatedAt: now })
    const updated = await getDoc(ref)
    return toCampaign(updated.id, updated.data() as Record<string, unknown>)
  }

  async cancelCampaign(tenantId: string, id: string): Promise<Campaign> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Campaign ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { status: "cancelled", updatedAt: now })
    const updated = await getDoc(ref)
    return toCampaign(updated.id, updated.data() as Record<string, unknown>)
  }

  async listCampaigns(tenantId: string, filters?: { status?: string; type?: string }): Promise<Campaign[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    if (filters?.type) constraints.splice(1, 0, where("type", "==", filters.type))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCampaign(d.id, d.data() as Record<string, unknown>))
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCampaign(snap.id, snap.data() as Record<string, unknown>)
  }

  async getCampaignAnalytics(tenantId: string, id: string): Promise<{ sent: number; delivered: number; opened: number; clicked: number; failed: number; engagementRate: number }> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, engagementRate: 0 }
    const data = snap.data() as Record<string, unknown>
    const sent = (data.sentCount as number) || 0
    const delivered = (data.deliveredCount as number) || 0
    const opened = (data.openedCount as number) || 0
    const clicked = (data.clickedCount as number) || 0
    const failed = (data.failedCount as number) || 0
    const engagementRate = delivered > 0 ? Math.round((opened / delivered) * 10000) / 100 : 0
    return { sent, delivered, opened, clicked, failed, engagementRate }
  }
}
