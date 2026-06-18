import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IRevenueDistributionService } from "./IRevenueDistributionService"
import type { RevenueDistributionRule, RevenueDistribution } from "@/types"

const RULES_COLLECTION = "revenueRules"
const DIST_COLLECTION = "revenueDistributions"

function toRule(id: string, data: Record<string, unknown>): RevenueDistributionRule {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    sourceType: (data.sourceType as string) || "",
    rules: (data.rules as RevenueDistributionRule["rules"]) || [],
    effectiveDate: (data.effectiveDate as string) || "",
    status: (data.status as "active" | "inactive" | "archived") || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toDistribution(id: string, data: Record<string, unknown>): RevenueDistribution {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    transactionId: (data.transactionId as string) || "",
    sourceAmount: (data.sourceAmount as number) || 0,
    distributions: (data.distributions as RevenueDistribution["distributions"]) || [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseRevenueDistributionService implements IRevenueDistributionService {
  private db = getFirestoreDb()

  async listRules(tenantId: string): Promise<RevenueDistributionRule[]> {
    const q = query(collection(this.db, RULES_COLLECTION), where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toRule(d.id, d.data() as Record<string, unknown>))
  }

  async getRule(id: string): Promise<RevenueDistributionRule | null> {
    const snap = await getDoc(doc(this.db, RULES_COLLECTION, id))
    if (!snap.exists()) return null
    return toRule(snap.id, snap.data() as Record<string, unknown>)
  }

  async createRule(data: Omit<RevenueDistributionRule, "id" | "createdAt" | "updatedAt">): Promise<RevenueDistributionRule> {
    const ref = await addDoc(collection(this.db, RULES_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getRule(ref.id) as Promise<RevenueDistributionRule>
  }

  async updateRule(id: string, data: Partial<RevenueDistributionRule>): Promise<RevenueDistributionRule> {
    await updateDoc(doc(this.db, RULES_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getRule(id) as Promise<RevenueDistributionRule>
  }

  async activateRule(id: string): Promise<void> {
    await updateDoc(doc(this.db, RULES_COLLECTION, id), { status: "active", updatedAt: new Date().toISOString() })
  }

  async deactivateRule(id: string): Promise<void> {
    await updateDoc(doc(this.db, RULES_COLLECTION, id), { status: "inactive", updatedAt: new Date().toISOString() })
  }

  async listDistributions(tenantId: string): Promise<RevenueDistribution[]> {
    const q = query(collection(this.db, DIST_COLLECTION), where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toDistribution(d.id, d.data() as Record<string, unknown>))
  }
}
