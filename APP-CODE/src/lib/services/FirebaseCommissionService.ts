import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICommissionService } from "./ICommissionService"
import type { CommissionConfig, Commission } from "@/types"

const CONFIG_COLLECTION = "commissionConfigs"
const COMM_COLLECTION = "commissions"

function toConfig(id: string, data: Record<string, unknown>): CommissionConfig {
  return {
    id,
    sourceType: (data.sourceType as string) || "",
    percentage: (data.percentage as number) || 0,
    effectiveDate: (data.effectiveDate as string) || "",
    status: (data.status as "active" | "inactive") || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toCommission(id: string, data: Record<string, unknown>): Commission {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    transactionId: (data.transactionId as string) || "",
    sourceType: (data.sourceType as string) || "",
    amount: (data.amount as number) || 0,
    percentage: (data.percentage as number) || 0,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseCommissionService implements ICommissionService {
  private db = getFirestoreDb()

  async listConfigs(): Promise<CommissionConfig[]> {
    const snap = await getDocs(query(collection(this.db, CONFIG_COLLECTION), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toConfig(d.id, d.data() as Record<string, unknown>))
  }

  async getConfig(id: string): Promise<CommissionConfig | null> {
    const snap = await getDoc(doc(this.db, CONFIG_COLLECTION, id))
    if (!snap.exists()) return null
    return toConfig(snap.id, snap.data() as Record<string, unknown>)
  }

  async createConfig(data: Omit<CommissionConfig, "id" | "createdAt" | "updatedAt">): Promise<CommissionConfig> {
    const ref = await addDoc(collection(this.db, CONFIG_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getConfig(ref.id) as Promise<CommissionConfig>
  }

  async updateConfig(id: string, data: Partial<CommissionConfig>): Promise<CommissionConfig> {
    await updateDoc(doc(this.db, CONFIG_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getConfig(id) as Promise<CommissionConfig>
  }

  async listCommissions(params?: { tenantId?: string; sourceType?: string }): Promise<Commission[]> {
    const col = collection(this.db, COMM_COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.sourceType) constraints.unshift(where("sourceType", "==", params.sourceType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCommission(d.id, d.data() as Record<string, unknown>))
  }

  async getCommissionStats(params?: { tenantId?: string }): Promise<{ totalCommissions: number; bySource: Record<string, number> }> {
    const col = collection(this.db, COMM_COLLECTION)
    const constraints: Parameters<typeof query>[1][] = []
    if (params?.tenantId) constraints.push(where("tenantId", "==", params.tenantId))
    const snap = await getDocs(query(col, ...constraints))
    const commissions = snap.docs.map((d) => toCommission(d.id, d.data() as Record<string, unknown>))
    const bySource: Record<string, number> = {}
    commissions.forEach((c) => { bySource[c.sourceType] = (bySource[c.sourceType] || 0) + c.amount })
    return { totalCommissions: commissions.reduce((s, c) => s + c.amount, 0), bySource }
  }
}
