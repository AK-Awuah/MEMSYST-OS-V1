import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISMSService } from "./ISMSService"
import type { SMSMessage, SMSStatus } from "@/types"

const COLLECTION = "smsMessages"

function toSMSMessage(id: string, data: Record<string, unknown>): SMSMessage {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    senderId: (data.senderId as string) || "",
    recipientId: (data.recipientId as string) || "",
    recipientPhone: (data.recipientPhone as string) || "",
    message: (data.message as string) || "",
    status: (data.status as SMSStatus) || "queued",
    sentAt: data.sentAt instanceof Timestamp
      ? data.sentAt.toDate().toISOString()
      : (data.sentAt as string) || undefined,
    units: (data.units as number) || 1,
    markup: (data.markup as number) || 0,
    totalCharge: (data.totalCharge as number) || 0,
    cost: (data.cost as number) || 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseSMSService implements ISMSService {
  private db = getFirestoreDb()

  async sendSMS(tenantId: string, data: { recipientId: string; recipientPhone: string; message: string; senderId: string }): Promise<SMSMessage> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      ...data,
      status: "sent" as SMSStatus,
      sentAt: now,
      units: 1,
      markup: 0,
      totalCharge: 0,
      cost: 0.03,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async sendBulkSMS(tenantId: string, data: { recipients: { recipientId: string; recipientPhone: string }[]; message: string; senderId: string }): Promise<SMSMessage[]> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const results = await Promise.all(
      data.recipients.map((r) =>
        addDoc(col, {
          tenantId,
          senderId: data.senderId,
          recipientId: r.recipientId,
          recipientPhone: r.recipientPhone,
          message: data.message,
          status: "queued",
          cost: 0.03,
          units: 1,
          markup: 0,
          totalCharge: 0,
          createdAt: now,
          updatedAt: now,
        })
      )
    )
    return results.map((ref, i) => ({
      id: ref.id,
      tenantId,
      senderId: data.senderId,
      recipientId: data.recipients[i].recipientId,
      recipientPhone: data.recipients[i].recipientPhone,
      message: data.message,
      status: "queued" as const,
      cost: 0.03,
      units: 1,
      markup: 0,
      totalCharge: 0,
      createdAt: now,
      updatedAt: now,
    }))
  }

  async scheduleSMS(tenantId: string, data: { recipientId: string; recipientPhone: string; message: string; senderId: string; scheduledAt: string }): Promise<SMSMessage> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      ...data,
      status: "queued" as const,
      cost: 0.03,
      units: 1,
      markup: 0,
      totalCharge: 0,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async listSMS(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<SMSMessage[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toSMSMessage(d.id, d.data() as Record<string, unknown>))
    if (filters?.from) results = results.filter((s) => new Date(s.createdAt) >= new Date(filters.from!))
    if (filters?.to) results = results.filter((s) => new Date(s.createdAt) <= new Date(filters.to!))
    return results
  }

  async getSMSById(id: string): Promise<SMSMessage | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toSMSMessage(snap.id, snap.data() as Record<string, unknown>)
  }
}
