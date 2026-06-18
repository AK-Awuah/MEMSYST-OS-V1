import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IRefundService } from "./IRefundService"
import type { Refund, RefundStatus } from "@/types"

const COLLECTION = "refunds"

function toRefund(id: string, data: Record<string, unknown>): Refund {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    transactionId: (data.transactionId as string) || "",
    amount: (data.amount as number) || 0,
    reason: (data.reason as string) || "",
    status: (data.status as RefundStatus) || "requested",
    requesterId: (data.requesterId as string) || "",
    approverId: (data.approverId as string) || undefined,
    reviewedAt: (data.reviewedAt as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseRefundService implements IRefundService {
  private db = getFirestoreDb()

  async listRefunds(params?: { tenantId?: string; status?: RefundStatus }): Promise<Refund[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toRefund(d.id, d.data() as Record<string, unknown>))
  }

  async getRefund(id: string): Promise<Refund | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toRefund(snap.id, snap.data() as Record<string, unknown>)
  }

  async requestRefund(data: Omit<Refund, "id" | "createdAt" | "updatedAt">): Promise<Refund> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getRefund(ref.id) as Promise<Refund>
  }

  async reviewRefund(id: string, status: "approved" | "rejected", approverId: string, reason?: string): Promise<Refund> {
    const updates: Record<string, unknown> = { status, approverId, reviewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    if (reason && status === "rejected") updates.reason = reason
    if (status === "approved") updates.status = "completed"
    await updateDoc(doc(this.db, COLLECTION, id), updates)
    return this.getRefund(id) as Promise<Refund>
  }

  async getRefundStats(tenantId?: string): Promise<{ totalRequested: number; approved: number; completed: number; totalAmount: number }> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = []
    if (tenantId) constraints.push(where("tenantId", "==", tenantId))
    const snap = await getDocs(query(col, ...constraints))
    const refunds = snap.docs.map((d) => toRefund(d.id, d.data() as Record<string, unknown>))
    return {
      totalRequested: refunds.length,
      approved: refunds.filter((r) => r.status === "approved").length,
      completed: refunds.filter((r) => r.status === "completed").length,
      totalAmount: refunds.reduce((s, r) => s + r.amount, 0),
    }
  }
}
