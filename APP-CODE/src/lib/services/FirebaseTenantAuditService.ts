import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITenantAuditService } from "./ITenantAuditService"
import type { TenantAuditLog } from "@/types"

const COLLECTION = "tenantAuditLogs"

function toLog(id: string, data: Record<string, unknown>): TenantAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as string) || "",
    module: (data.module as string) || "",
    record: (data.record as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseTenantAuditService implements ITenantAuditService {
  private db = getFirestoreDb()

  async listEvents(tenantId: string, params?: { module?: string; action?: string }): Promise<TenantAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.module) constraints.unshift(where("module", "==", params.module))
    if (params?.action) constraints.unshift(where("action", "==", params.action))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toLog(d.id, d.data() as Record<string, unknown>))
  }

  async recordEvent(data: Omit<TenantAuditLog, "id" | "createdAt">): Promise<void> {
    await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString() })
  }
}
