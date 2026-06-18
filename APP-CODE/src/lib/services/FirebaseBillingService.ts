import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IBillingService } from "./IBillingService"
import type { Bill, BillType, BillStatus } from "@/types"

const COLLECTION = "bills"

function toBill(id: string, data: Record<string, unknown>): Bill {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    type: (data.type as BillType) || "custom_fee",
    amount: (data.amount as number) || 0,
    paidAmount: (data.paidAmount as number) || 0,
    dueDate: (data.dueDate as string) || "",
    paidDate: (data.paidDate as string) || undefined,
    status: (data.status as BillStatus) || "draft",
    description: (data.description as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseBillingService implements IBillingService {
  private db = getFirestoreDb()

  async listBills(params?: { tenantId?: string; memberId?: string; type?: BillType; status?: BillStatus }): Promise<Bill[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.memberId) constraints.unshift(where("memberId", "==", params.memberId))
    if (params?.type) constraints.unshift(where("type", "==", params.type))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toBill(d.id, d.data() as Record<string, unknown>))
  }

  async getBill(id: string): Promise<Bill | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toBill(snap.id, snap.data() as Record<string, unknown>)
  }

  async createBill(data: Omit<Bill, "id" | "createdAt" | "updatedAt">): Promise<Bill> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getBill(ref.id) as Promise<Bill>
  }

  async updateBillStatus(id: string, status: BillStatus): Promise<Bill> {
    const updates: Record<string, unknown> = { status, updatedAt: new Date().toISOString() }
    if (status === "paid") updates.paidDate = new Date().toISOString()
    await updateDoc(doc(this.db, COLLECTION, id), updates)
    return this.getBill(id) as Promise<Bill>
  }

  async getBillingStats(tenantId?: string): Promise<{ totalBills: number; paidBills: number; overdueBills: number; totalOutstanding: number }> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = []
    if (tenantId) constraints.push(where("tenantId", "==", tenantId))
    const snap = await getDocs(query(col, ...constraints))
    const bills = snap.docs.map((d) => toBill(d.id, d.data() as Record<string, unknown>))
    return {
      totalBills: bills.length,
      paidBills: bills.filter((b) => b.status === "paid").length,
      overdueBills: bills.filter((b) => b.status === "overdue").length,
      totalOutstanding: bills.reduce((s, b) => s + (b.amount - b.paidAmount), 0),
    }
  }
}
