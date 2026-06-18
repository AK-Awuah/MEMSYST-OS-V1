import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IRenewalService } from "./IRenewalService"
import type { RenewalRecord, MemberRenewalStatus } from "@/types"

const COLLECTION = "memberRenewals"

function toRenewal(id: string, data: Record<string, unknown>): RenewalRecord {
  return {
    id, tenantId: (data.tenantId as string) || "", memberId: (data.memberId as string) || "",
    previousExpiryDate: (data.previousExpiryDate as string) || "", newExpiryDate: (data.newExpiryDate as string) || "",
    status: (data.status as RenewalRecord["status"]) || "pending",
    amount: (data.amount as number) || 0, paymentReference: (data.paymentReference as string) || undefined,
    verifiedAt: (data.verifiedAt as string) || undefined, renewedAt: (data.renewedAt as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseRenewalService implements IRenewalService {
  private db = getFirestoreDb()

  async listRenewals(tenantId: string, params?: { status?: string }): Promise<RenewalRecord[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toRenewal(d.id, d.data() as Record<string, unknown>))
  }

  async getRenewal(id: string): Promise<RenewalRecord | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toRenewal(snap.id, snap.data() as Record<string, unknown>)
  }

  async createRenewal(data: Omit<RenewalRecord, "id" | "createdAt" | "updatedAt">): Promise<RenewalRecord> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getRenewal(ref.id) as Promise<RenewalRecord>
  }

  async updateRenewalStatus(id: string, status: RenewalRecord["status"]): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
  }

  async getMemberRenewals(memberId: string): Promise<RenewalRecord[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toRenewal(d.id, d.data() as Record<string, unknown>))
  }

  async updateMemberRenewalStatus(_memberId: string, _status: MemberRenewalStatus): Promise<void> {}
}
