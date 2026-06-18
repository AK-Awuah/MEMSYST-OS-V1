import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMarketplaceApprovalService } from "./IMarketplaceApprovalService"
import type { MarketplaceApproval } from "@/types"

const COLLECTION = "marketplaceApprovals"

function toMarketplaceApproval(id: string, data: Record<string, unknown>): MarketplaceApproval {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    listingId: (data.listingId as string) || "",
    listingType: (data.listingType as MarketplaceApproval["listingType"]) || "listing",
    status: (data.status as MarketplaceApproval["status"]) || "pending",
    reviewerId: data.reviewerId as string | undefined,
    reviewerName: data.reviewerName as string | undefined,
    reviewNotes: data.reviewNotes as string | undefined,
    reviewedAt: data.reviewedAt as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseMarketplaceApprovalService implements IMarketplaceApprovalService {
  private db = getFirestoreDb()

  async listPendingApprovals(tenantId: string): Promise<MarketplaceApproval[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), where("status", "==", "pending"), orderBy("createdAt", "desc")]
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toMarketplaceApproval(d.id, d.data() as Record<string, unknown>))
  }

  async getApproval(id: string): Promise<MarketplaceApproval | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toMarketplaceApproval(snap.id, snap.data() as Record<string, unknown>)
  }

  async createApproval(data: Omit<MarketplaceApproval, "id" | "createdAt">): Promise<MarketplaceApproval> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    return this.getApproval(ref.id) as Promise<MarketplaceApproval>
  }

  async approveListing(id: string, reviewerId: string, reviewerName: string): Promise<MarketplaceApproval> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "approved",
      reviewerId,
      reviewerName,
      reviewedAt: new Date().toISOString(),
    })
    return this.getApproval(id) as Promise<MarketplaceApproval>
  }

  async rejectListing(id: string, reviewerId: string, reviewerName: string, reason: string): Promise<MarketplaceApproval> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "rejected",
      reviewerId,
      reviewerName,
      reviewNotes: reason,
      reviewedAt: new Date().toISOString(),
    })
    return this.getApproval(id) as Promise<MarketplaceApproval>
  }

  async requestChanges(id: string, reviewerId: string, reviewerName: string, notes: string): Promise<MarketplaceApproval> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "changes_requested",
      reviewerId,
      reviewerName,
      reviewNotes: notes,
      reviewedAt: new Date().toISOString(),
    })
    return this.getApproval(id) as Promise<MarketplaceApproval>
  }

  async getPlatformPendingApprovals(): Promise<MarketplaceApproval[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("status", "==", "pending"), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toMarketplaceApproval(d.id, d.data() as Record<string, unknown>))
  }
}
