import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITieringService } from "./ITieringService"
import type { PremiumAccount, PremiumListing, VisibilityRule, TieringAuditLog, PremiumTier } from "@/types"

const ACCOUNTS_COLLECTION = "premium_accounts"
const LISTINGS_COLLECTION = "premium_listings"
const RULES_COLLECTION = "visibility_rules"
const AUDIT_COLLECTION = "tiering_audit_logs"

function toAccount(id: string, data: Record<string, unknown>): PremiumAccount {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    tier: (data.tier as PremiumTier) || "free",
    benefits: (data.benefits as PremiumAccount["benefits"]) || [],
    subscriptionId: data.subscriptionId as string | undefined,
    autoRenew: (data.autoRenew as boolean) || false,
    startDate: (data.startDate as string) || "",
    expiryDate: data.expiryDate as string | undefined,
    status: (data.status as PremiumAccount["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toListing(id: string, data: Record<string, unknown>): PremiumListing {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    listingId: (data.listingId as string) || "",
    listingType: (data.listingType as string) || "",
    listingTitle: (data.listingTitle as string) || "",
    ownerId: (data.ownerId as string) || "",
    tier: (data.tier as PremiumTier) || "free",
    boostFactor: (data.boostFactor as number) || 1,
    placementPriority: (data.placementPriority as number) || 0,
    featuredUntil: data.featuredUntil as string | undefined,
    isFeatured: (data.isFeatured as boolean) || false,
    status: (data.status as PremiumListing["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toRule(id: string, data: Record<string, unknown>): VisibilityRule {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    entityType: (data.entityType as VisibilityRule["entityType"]) || "member",
    criteria: (data.criteria as Record<string, unknown>) || {},
    priority: (data.priority as number) || 0,
    boostFactor: (data.boostFactor as number) || 1,
    isActive: (data.isActive as boolean) || false,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): TieringAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as TieringAuditLog["action"]) || "account_upgraded",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseTieringService implements ITieringService {
  private db = getFirestoreDb()

  async listAccounts(tenantId: string): Promise<PremiumAccount[]> {
    const col = collection(this.db, ACCOUNTS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAccount(d.id, d.data() as Record<string, unknown>))
  }

  async getAccount(id: string): Promise<PremiumAccount | null> {
    const snap = await getDoc(doc(this.db, ACCOUNTS_COLLECTION, id))
    if (!snap.exists()) return null
    return toAccount(snap.id, snap.data() as Record<string, unknown>)
  }

  async upgradeAccount(id: string, tier: PremiumTier): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, ACCOUNTS_COLLECTION, id), { tier, status: "active", updatedAt: now })
  }

  async downgradeAccount(id: string, tier: PremiumTier): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, ACCOUNTS_COLLECTION, id), { tier, updatedAt: now })
  }

  async cancelAccount(id: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, ACCOUNTS_COLLECTION, id), { status: "cancelled", updatedAt: now })
  }

  async listListings(tenantId: string): Promise<PremiumListing[]> {
    const col = collection(this.db, LISTINGS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toListing(d.id, d.data() as Record<string, unknown>))
  }

  async getListing(id: string): Promise<PremiumListing | null> {
    const snap = await getDoc(doc(this.db, LISTINGS_COLLECTION, id))
    if (!snap.exists()) return null
    return toListing(snap.id, snap.data() as Record<string, unknown>)
  }

  async featureListing(id: string, featuredUntil?: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, LISTINGS_COLLECTION, id), { isFeatured: true, featuredUntil: featuredUntil || "", updatedAt: now })
  }

  async boostListing(id: string, boostFactor: number): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, LISTINGS_COLLECTION, id), { boostFactor, updatedAt: now })
  }

  async listRules(tenantId: string): Promise<VisibilityRule[]> {
    const col = collection(this.db, RULES_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toRule(d.id, d.data() as Record<string, unknown>))
  }

  async getRule(id: string): Promise<VisibilityRule | null> {
    const snap = await getDoc(doc(this.db, RULES_COLLECTION, id))
    if (!snap.exists()) return null
    return toRule(snap.id, snap.data() as Record<string, unknown>)
  }

  async createRule(tenantId: string, data: Omit<VisibilityRule, "id" | "createdAt" | "updatedAt">): Promise<VisibilityRule> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, RULES_COLLECTION), { ...data, tenantId, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toRule(created.id, created.data() as Record<string, unknown>)
  }

  async updateRule(id: string, data: Partial<VisibilityRule>): Promise<void> {
    await updateDoc(doc(this.db, RULES_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async toggleRule(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(this.db, RULES_COLLECTION, id), { isActive, updatedAt: new Date().toISOString() })
  }

  async getAuditLogs(tenantId: string): Promise<TieringAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
