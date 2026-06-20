import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITrainingAuditService } from "./ITrainingAuditService"
import type { TrainingAuditLog, TrainingAuditAction } from "@/types"

const COLLECTION = "trainingAuditLogs"

function toAuditLog(id: string, data: Record<string, unknown>): TrainingAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as TrainingAuditAction) || "course_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseTrainingAuditService implements ITrainingAuditService {
  private db = getFirestoreDb()

  async listAuditLogs(tenantId: string, params?: { action?: TrainingAuditAction; recordType?: string; dateFrom?: string; dateTo?: string }): Promise<TrainingAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.action) constraints.unshift(where("action", "==", params.action))
    if (params?.recordType) constraints.unshift(where("recordType", "==", params.recordType))
    if (params?.dateFrom) constraints.unshift(where("createdAt", ">=", params.dateFrom))
    if (params?.dateTo) constraints.unshift(where("createdAt", "<=", params.dateTo))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }

  async getAuditLog(id: string): Promise<TrainingAuditLog | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toAuditLog(snap.id, snap.data() as Record<string, unknown>)
  }

  async createAuditLog(data: Omit<TrainingAuditLog, "id" | "createdAt">): Promise<TrainingAuditLog> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    return this.getAuditLog(ref.id) as Promise<TrainingAuditLog>
  }

  async deleteAuditLog(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
