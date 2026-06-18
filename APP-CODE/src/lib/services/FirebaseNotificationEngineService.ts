import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { INotificationEngineService } from "./INotificationEngineService"
import type { Notification } from "@/types"

const COLLECTION = "notificationEngine"

function toNotification(id: string, data: Record<string, unknown>): Notification {
  return {
    id,
    type: (data.type as Notification["type"]) || "new_lead",
    title: (data.title as string) || "",
    message: (data.message as string) || "",
    recipientId: (data.recipientId as string) || "",
    relatedId: (data.relatedId as string) || undefined,
    relatedModule: (data.relatedModule as string) || undefined,
    status: (data.status as Notification["status"]) || "unread",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
  }
}

export class FirebaseNotificationEngineService implements INotificationEngineService {
  private db = getFirestoreDb()

  async triggerNotification(tenantId: string, event: string, recipientId: string, data?: Record<string, unknown>): Promise<void> {
    const col = collection(this.db, COLLECTION)
    const payload = {
      tenantId,
      event,
      recipientId,
      data: data || {},
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await addDoc(col, payload)
  }

  async getNotificationHistory(tenantId: string, filters?: { status?: string; channel?: string; from?: string; to?: string }): Promise<Notification[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toNotification(d.id, d.data() as Record<string, unknown>))
    if (filters?.channel) results = results.filter((r) => (r as unknown as Record<string, unknown>).channel === filters.channel)
    if (filters?.from) results = results.filter((r) => new Date(r.createdAt) >= new Date(filters.from!))
    if (filters?.to) results = results.filter((r) => new Date(r.createdAt) <= new Date(filters.to!))
    return results
  }

  async getNotificationStats(tenantId: string): Promise<{ total: number; sent: number; delivered: number; failed: number }> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    let total = 0, sent = 0, delivered = 0, failed = 0
    snap.docs.forEach((d) => {
      total++
      const status = (d.data() as Record<string, unknown>).status as string
      if (status === "sent") sent++
      else if (status === "delivered") delivered++
      else if (status === "failed") failed++
    })
    return { total, sent, delivered, failed }
  }
}
