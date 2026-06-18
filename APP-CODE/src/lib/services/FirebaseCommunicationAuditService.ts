import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICommunicationAuditService } from "./ICommunicationAuditService"
import type { CommunicationAuditLog, CommunicationAuditAction, NotificationChannel } from "@/types"

const COLLECTION = "communicationAuditLogs"

function toCommunicationAuditLog(id: string, data: Record<string, unknown>): CommunicationAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as CommunicationAuditAction) || "message_sent",
    channel: (data.channel as NotificationChannel) || "email",
    audience: data.audience as string | undefined,
    targetId: data.targetId as string | undefined,
    details: data.details as string | undefined,
    result: (data.result as "success" | "failure") || "success",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
  }
}

export class FirebaseCommunicationAuditService implements ICommunicationAuditService {
  private db = getFirestoreDb()

  async logEvent(tenantId: string, data: Omit<CommunicationAuditLog, "id" | "createdAt">): Promise<void> {
    const col = collection(this.db, COLLECTION)
    await addDoc(col, {
      ...data,
      tenantId,
      createdAt: new Date().toISOString(),
    })
  }

  async listAuditLogs(tenantId: string, filters?: { action?: string; channel?: string; from?: string; to?: string }): Promise<CommunicationAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.action) constraints.splice(1, 0, where("action", "==", filters.action))
    if (filters?.channel) constraints.splice(1, 0, where("channel", "==", filters.channel))
    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toCommunicationAuditLog(d.id, d.data() as Record<string, unknown>))
    if (filters?.from) results = results.filter((l) => new Date(l.createdAt) >= new Date(filters.from!))
    if (filters?.to) results = results.filter((l) => new Date(l.createdAt) <= new Date(filters.to!))
    return results
  }

  async getAuditLogById(id: string): Promise<CommunicationAuditLog | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCommunicationAuditLog(snap.id, snap.data() as Record<string, unknown>)
  }
}
