import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IPushNotificationService } from "./IPushNotificationService"
import type { PushNotificationRecord, PushStatus } from "@/types"

const COLLECTION = "pushNotifications"

function toPushNotificationRecord(id: string, data: Record<string, unknown>): PushNotificationRecord {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    senderId: (data.senderId as string) || "",
    recipientId: (data.recipientId as string) || "",
    title: (data.title as string) || "",
    body: (data.body as string) || "",
    data: (data.data as Record<string, string>) || undefined,
    status: (data.status as PushStatus) || "queued",
    sentAt: data.sentAt instanceof Timestamp
      ? data.sentAt.toDate().toISOString()
      : (data.sentAt as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebasePushNotificationService implements IPushNotificationService {
  private db = getFirestoreDb()

  async sendPush(tenantId: string, data: { recipientId: string; title: string; body: string; data?: Record<string, string>; senderId: string }): Promise<PushNotificationRecord> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      ...data,
      status: "sent" as PushStatus,
      sentAt: now,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async sendBulkPush(tenantId: string, data: { recipients: string[]; title: string; body: string; senderId: string }): Promise<PushNotificationRecord[]> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const results = await Promise.all(
      data.recipients.map((recipientId) =>
        addDoc(col, {
          tenantId,
          senderId: data.senderId,
          recipientId,
          title: data.title,
          body: data.body,
          status: "queued",
          createdAt: now,
          updatedAt: now,
        })
      )
    )
    return results.map((ref, i) => ({
      id: ref.id,
      tenantId,
      senderId: data.senderId,
      recipientId: data.recipients[i],
      title: data.title,
      body: data.body,
      status: "queued" as const,
      createdAt: now,
      updatedAt: now,
    }))
  }

  async schedulePush(tenantId: string, data: { recipientId: string; title: string; body: string; senderId: string; scheduledAt: string }): Promise<PushNotificationRecord> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      ...data,
      status: "queued" as const,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async listPushNotifications(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<PushNotificationRecord[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toPushNotificationRecord(d.id, d.data() as Record<string, unknown>))
    if (filters?.from) results = results.filter((p) => new Date(p.createdAt) >= new Date(filters.from!))
    if (filters?.to) results = results.filter((p) => new Date(p.createdAt) <= new Date(filters.to!))
    return results
  }

  async getPushNotificationById(id: string): Promise<PushNotificationRecord | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toPushNotificationRecord(snap.id, snap.data() as Record<string, unknown>)
  }
}
