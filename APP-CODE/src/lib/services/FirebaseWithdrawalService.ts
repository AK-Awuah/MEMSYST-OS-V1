import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IWithdrawalService } from "./IWithdrawalService"
import type { Withdrawal, WithdrawalStatus } from "@/types"

const COLLECTION = "withdrawals"

function toWithdrawal(id: string, data: Record<string, unknown>): Withdrawal {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    walletId: (data.walletId as string) || "",
    walletType: (data.walletType as Withdrawal["walletType"]) || "tenant",
    ownerName: (data.ownerName as string) || "",
    amount: (data.amount as number) || 0,
    fee: (data.fee as number) || 0,
    netAmount: (data.netAmount as number) || 0,
    status: (data.status as WithdrawalStatus) || "draft",
    reason: (data.reason as string) || "",
    supportingDocs: (data.supportingDocs as string[]) || undefined,
    payoutMethod: (data.payoutMethod as "bank_account" | "mobile_money") || "mobile_money",
    payoutDestination: (data.payoutDestination as string) || "",
    lockedAt: (data.lockedAt as string) || undefined,
    completedAt: (data.completedAt as string) || undefined,
    reviewedBy: (data.reviewedBy as string) || undefined,
    rejectionReason: (data.rejectionReason as string) || undefined,
    referenceNumber: (data.referenceNumber as string) || undefined,
    transferId: (data.transferId as string) || undefined,
    proofOfPayment: (data.proofOfPayment as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseWithdrawalService implements IWithdrawalService {
  private db = getFirestoreDb()

  async listWithdrawals(params?: { tenantId?: string; walletId?: string; status?: WithdrawalStatus }): Promise<Withdrawal[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.walletId) constraints.unshift(where("walletId", "==", params.walletId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toWithdrawal(d.id, d.data() as Record<string, unknown>))
  }

  async getWithdrawal(id: string): Promise<Withdrawal | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toWithdrawal(snap.id, snap.data() as Record<string, unknown>)
  }

  async createWithdrawal(data: Omit<Withdrawal, "id" | "createdAt" | "updatedAt">): Promise<Withdrawal> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getWithdrawal(ref.id) as Promise<Withdrawal>
  }

  async updateStatus(id: string, status: WithdrawalStatus, extra?: { reviewedBy?: string; rejectionReason?: string; referenceNumber?: string; transferId?: string; proofOfPayment?: string }): Promise<Withdrawal> {
    const updates: Record<string, unknown> = { status, updatedAt: new Date().toISOString(), ...extra }
    if (status === "completed") updates.completedAt = new Date().toISOString()
    if (status === "approved" || status === "processing") updates.lockedAt = new Date().toISOString()
    await updateDoc(doc(this.db, COLLECTION, id), updates)
    return this.getWithdrawal(id) as Promise<Withdrawal>
  }

  async getWithdrawalStats(tenantId?: string): Promise<{ pending: number; approved: number; completed: number; totalRequested: number; totalFees: number }> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = []
    if (tenantId) constraints.push(where("tenantId", "==", tenantId))
    const snap = await getDocs(query(col, ...constraints))
    const withdrawals = snap.docs.map((d) => toWithdrawal(d.id, d.data() as Record<string, unknown>))
    return {
      pending: withdrawals.filter((w) => ["submitted", "under_review", "platform_review"].includes(w.status)).length,
      approved: withdrawals.filter((w) => w.status === "approved").length,
      completed: withdrawals.filter((w) => w.status === "completed").length,
      totalRequested: withdrawals.reduce((s, w) => s + w.amount, 0),
      totalFees: withdrawals.reduce((s, w) => s + w.fee, 0),
    }
  }
}
