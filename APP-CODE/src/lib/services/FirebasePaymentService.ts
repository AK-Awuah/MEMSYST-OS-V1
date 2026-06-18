import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IPaymentService } from "./IPaymentService"
import type { Payment, PaymentStatus } from "@/types"

const COLLECTION = "payments"

function toPayment(id: string, data: Record<string, unknown>): Payment {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    transactionId: (data.transactionId as string) || "",
    memberId: (data.memberId as string) || "",
    paymentMethod: (data.paymentMethod as Payment["paymentMethod"]) || "mobile_money",
    amount: (data.amount as number) || 0,
    fee: (data.fee as number) || 0,
    netAmount: (data.netAmount as number) || 0,
    status: (data.status as PaymentStatus) || "pending",
    channel: (data.channel as string) || "",
    reference: (data.reference as string) || "",
    metadata: (data.metadata as Record<string, unknown>) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebasePaymentService implements IPaymentService {
  private db = getFirestoreDb()

  async listPayments(params?: { tenantId?: string; memberId?: string; status?: PaymentStatus }): Promise<Payment[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.memberId) constraints.unshift(where("memberId", "==", params.memberId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toPayment(d.id, d.data() as Record<string, unknown>))
  }

  async getPayment(id: string): Promise<Payment | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toPayment(snap.id, snap.data() as Record<string, unknown>)
  }

  async processPayment(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getPayment(ref.id) as Promise<Payment>
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
    return this.getPayment(id) as Promise<Payment>
  }

  async getPaymentStats(tenantId?: string): Promise<{ totalPayments: number; successfulPayments: number; totalAmount: number; totalFees: number }> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = []
    if (tenantId) constraints.push(where("tenantId", "==", tenantId))
    const snap = await getDocs(query(col, ...constraints))
    const payments = snap.docs.map((d) => toPayment(d.id, d.data() as Record<string, unknown>))
    return {
      totalPayments: payments.length,
      successfulPayments: payments.filter((p) => p.status === "successful").length,
      totalAmount: payments.reduce((s, p) => s + p.amount, 0),
      totalFees: payments.reduce((s, p) => s + p.fee, 0),
    }
  }
}
