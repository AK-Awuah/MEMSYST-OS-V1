import {
  collection, getDocs, getDoc, doc, updateDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IDeliveryTrackingService } from "./IDeliveryTrackingService"
import type { DeliveryLog, DeliveryStatus, NotificationChannel } from "@/types"

const COLLECTION = "deliveryLogs"

function toDeliveryLog(id: string, data: Record<string, unknown>): DeliveryLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    messageId: (data.messageId as string) || "",
    channel: (data.channel as NotificationChannel) || "email",
    recipientId: (data.recipientId as string) || "",
    status: (data.status as DeliveryStatus) || "pending",
    providerResponse: (data.providerResponse as string) || undefined,
    attempts: (data.attempts as number) || 0,
    maxAttempts: (data.maxAttempts as number) || 3,
    lastAttemptAt: data.lastAttemptAt instanceof Timestamp
      ? data.lastAttemptAt.toDate().toISOString()
      : (data.lastAttemptAt as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseDeliveryTrackingService implements IDeliveryTrackingService {
  private db = getFirestoreDb()

  async getDeliveryLog(tenantId: string, messageId: string): Promise<DeliveryLog | null> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("messageId", "==", messageId)
      )
    )
    if (snap.empty) return null
    return toDeliveryLog(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
  }

  async getDeliveryLogs(tenantId: string, filters?: { status?: string; channel?: string; from?: string; to?: string }): Promise<DeliveryLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    if (filters?.channel) constraints.splice(1, 0, where("channel", "==", filters.channel))
    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toDeliveryLog(d.id, d.data() as Record<string, unknown>))
    if (filters?.from) results = results.filter((l) => new Date(l.createdAt) >= new Date(filters.from!))
    if (filters?.to) results = results.filter((l) => new Date(l.createdAt) <= new Date(filters.to!))
    return results
  }

  async retryFailedDelivery(tenantId: string, messageId: string): Promise<DeliveryLog> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("messageId", "==", messageId)
      )
    )
    if (snap.empty) throw new Error(`Delivery log for message ${messageId} not found`)
    const ref = doc(this.db, COLLECTION, snap.docs[0].id)
    const data = snap.docs[0].data() as Record<string, unknown>
    const now = new Date().toISOString()
    const attempts = ((data.attempts as number) || 0) + 1
    await updateDoc(ref, {
      status: "retrying",
      attempts,
      lastAttemptAt: now,
      updatedAt: now,
    })
    const updated = await getDoc(ref)
    return toDeliveryLog(updated.id, updated.data() as Record<string, unknown>)
  }

  async updateDeliveryStatus(id: string, status: DeliveryStatus, providerResponse?: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    const now = new Date().toISOString()
    const updateData: Record<string, unknown> = { status, updatedAt: now }
    if (providerResponse) updateData.providerResponse = providerResponse
    if (status === "delivered") updateData.deliveredAt = now
    await updateDoc(ref, updateData)
  }
}
