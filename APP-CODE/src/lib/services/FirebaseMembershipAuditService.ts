import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMembershipAuditService } from "./IMembershipAuditService"
import type { MembershipAuditLog } from "@/types"

const COLLECTION = "membershipAuditLogs"

function toLog(id: string, data: Record<string, unknown>): MembershipAuditLog {
  return {
    id, tenantId: (data.tenantId as string) || "", memberId: (data.memberId as string) || undefined,
    apprenticeId: (data.apprenticeId as string) || undefined, actor: (data.actor as string) || "",
    action: (data.action as string) || "", recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "", previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseMembershipAuditService implements IMembershipAuditService {
  private db = getFirestoreDb()

  async listEvents(tenantId: string, params?: { memberId?: string; action?: string }): Promise<MembershipAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.memberId) constraints.unshift(where("memberId", "==", params.memberId))
    if (params?.action && params.action !== "all") constraints.unshift(where("action", "==", params.action))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toLog(d.id, d.data() as Record<string, unknown>))
  }

  async recordEvent(data: Omit<MembershipAuditLog, "id" | "createdAt">): Promise<void> {
    await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString() })
  }
}
