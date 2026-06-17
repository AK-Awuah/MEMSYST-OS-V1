import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAuditService } from "./IAuditService"
import type { AuditLog } from "@/types"

const COLLECTION = "auditLogs"

function toAuditLog(id: string, data: Record<string, unknown>): AuditLog {
  return {
    id,
    actor: (data.actor as string) || "",
    role: (data.role as string) || "",
    action: (data.action as string) || "",
    module: (data.module as string) || "",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    ipAddress: (data.ipAddress as string) || "",
    previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
  }
}

export class FirebaseAuditService implements IAuditService {
  private db = getFirestoreDb()

  async listLogs(): Promise<AuditLog[]> {
    const snap = await getDocs(query(collection(this.db, COLLECTION), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }

  async log(entry: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
    await addDoc(collection(this.db, COLLECTION), {
      ...entry,
      createdAt: new Date().toISOString(),
    })
  }

  async getLogsByRecord(recordType: string, recordId: string): Promise<AuditLog[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("recordType", "==", recordType),
        where("recordId", "==", recordId),
        orderBy("createdAt", "desc")
      )
    )
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
