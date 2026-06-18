import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IEmailService } from "./IEmailService"
import type { EmailMessage, EmailStatus } from "@/types"

const COLLECTION = "emails"

function toEmailMessage(id: string, data: Record<string, unknown>): EmailMessage {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    senderId: (data.senderId as string) || "",
    senderName: (data.senderName as string) || "",
    recipientId: (data.recipientId as string) || "",
    recipientEmail: (data.recipientEmail as string) || "",
    recipientName: (data.recipientName as string) || "",
    subject: (data.subject as string) || "",
    body: (data.body as string) || "",
    templateId: (data.templateId as string) || undefined,
    status: (data.status as EmailStatus) || "queued",
    sentAt: data.sentAt instanceof Timestamp
      ? data.sentAt.toDate().toISOString()
      : (data.sentAt as string) || undefined,
    cost: (data.cost as number) || 0,
    markup: (data.markup as number) || 0,
    totalCharge: (data.totalCharge as number) || 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseEmailService implements IEmailService {
  private db = getFirestoreDb()

  async sendEmail(tenantId: string, data: { recipientId: string; recipientEmail: string; recipientName: string; subject: string; body: string; senderId: string; senderName: string; templateId?: string }): Promise<EmailMessage> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      ...data,
      status: "sent" as EmailStatus,
      sentAt: now,
      cost: 0.05,
      markup: 0.01,
      totalCharge: 0.06,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async sendBulkEmail(tenantId: string, data: { recipients: { recipientId: string; recipientEmail: string; recipientName: string }[]; subject: string; body: string; senderId: string; senderName: string; templateId?: string }): Promise<EmailMessage[]> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const results = await Promise.all(
      data.recipients.map((r) =>
        addDoc(col, {
          tenantId,
          senderId: data.senderId,
          senderName: data.senderName,
          recipientId: r.recipientId,
          recipientEmail: r.recipientEmail,
          recipientName: r.recipientName,
          subject: data.subject,
          body: data.body,
          templateId: data.templateId,
          status: "queued",
          cost: 0.05,
          markup: 0.01,
          totalCharge: 0.06,
          createdAt: now,
          updatedAt: now,
        })
      )
    )
    return results.map((ref, i) => ({
      id: ref.id,
      tenantId,
      senderId: data.senderId,
      senderName: data.senderName,
      recipientId: data.recipients[i].recipientId,
      recipientEmail: data.recipients[i].recipientEmail,
      recipientName: data.recipients[i].recipientName,
      subject: data.subject,
      body: data.body,
      templateId: data.templateId,
      status: "queued" as const,
      cost: 0.05,
      markup: 0.01,
      totalCharge: 0.06,
      createdAt: now,
      updatedAt: now,
    }))
  }

  async scheduleEmail(tenantId: string, data: { recipientId: string; recipientEmail: string; recipientName: string; subject: string; body: string; senderId: string; senderName: string; scheduledAt: string }): Promise<EmailMessage> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      ...data,
      status: "queued" as const,
      cost: 0.05,
      markup: 0.01,
      totalCharge: 0.06,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async listEmails(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<EmailMessage[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toEmailMessage(d.id, d.data() as Record<string, unknown>))
    if (filters?.from) results = results.filter((e) => new Date(e.createdAt) >= new Date(filters.from!))
    if (filters?.to) results = results.filter((e) => new Date(e.createdAt) <= new Date(filters.to!))
    return results
  }

  async getEmailById(id: string): Promise<EmailMessage | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toEmailMessage(snap.id, snap.data() as Record<string, unknown>)
  }
}
