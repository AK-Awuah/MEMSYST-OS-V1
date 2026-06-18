import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMarketplaceAuditService } from "./IMarketplaceAuditService"
import type { MarketplaceAuditLog, MarketplaceAuditAction } from "@/types"

const COLLECTION = "marketplaceAuditLogs"

function toMarketplaceAuditLog(id: string, data: Record<string, unknown>): MarketplaceAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as MarketplaceAuditAction) || "listing_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseMarketplaceAuditService implements IMarketplaceAuditService {
  private db = getFirestoreDb()

  async listAuditLogs(tenantId: string, params?: {
    action?: MarketplaceAuditAction
    recordType?: string
  }): Promise<MarketplaceAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.action) constraints.unshift(where("action", "==", params.action))
    if (params?.recordType) constraints.unshift(where("recordType", "==", params.recordType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toMarketplaceAuditLog(d.id, d.data() as Record<string, unknown>))
  }

  async getAuditLog(id: string): Promise<MarketplaceAuditLog | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toMarketplaceAuditLog(snap.id, snap.data() as Record<string, unknown>)
  }

  async logAction(data: Omit<MarketplaceAuditLog, "id" | "createdAt">): Promise<MarketplaceAuditLog> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return toMarketplaceAuditLog(snap.id, snap.data() as Record<string, unknown>)
  }

  async getPlatformAuditLogs(): Promise<MarketplaceAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toMarketplaceAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
