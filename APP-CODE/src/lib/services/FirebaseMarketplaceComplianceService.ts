import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, Timestamp,
} from "firebase/firestore"
import type { QueryConstraint } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMarketplaceComplianceService } from "./IMarketplaceComplianceService"
import type { MarketplaceListing, MarketplaceListingStatus, MarketplaceListingType, MarketplaceModerationRecord } from "@/types"

const LISTINGS_COLLECTION = "marketplaceListings"
const MODERATION_COLLECTION = "marketplaceModerationRecords"

function toMarketplaceListing(id: string, data: Record<string, unknown>): MarketplaceListing {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    listingType: (data.listingType as MarketplaceListingType) || "product",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    status: (data.status as MarketplaceListingStatus) || "draft",
    price: data.price as number | undefined,
    currency: data.currency as string | undefined,
    location: data.location as string | undefined,
    images: (data.images as string[]) || [],
    videos: (data.videos as string[]) || [],
    documents: (data.documents as string[]) || [],
    categoryId: data.categoryId as string | undefined,
    tags: (data.tags as string[]) || [],
    viewCount: (data.viewCount as number) || 0,
    createdDate: (data.createdDate as string) || "",
    expiryDate: data.expiryDate as string | undefined,
    publishedAt: data.publishedAt as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

function toModerationRecord(id: string, data: Record<string, unknown>): MarketplaceModerationRecord {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    listingId: data.listingId as string | undefined,
    businessId: data.businessId as string | undefined,
    action: (data.action as MarketplaceModerationRecord["action"]) || "flagged",
    reason: (data.reason as string) || "",
    performedBy: (data.performedBy as string) || "",
    performedById: (data.performedById as string) || "",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseMarketplaceComplianceService implements IMarketplaceComplianceService {
  private db = getFirestoreDb()

  async getAllListings(params?: { tenantId?: string; status?: string }): Promise<MarketplaceListing[]> {
    const col = collection(this.db, LISTINGS_COLLECTION)
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toMarketplaceListing(d.id, d.data() as Record<string, unknown>))
  }

  async flagListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord> {
    const allListings = await this.getAllListings({ tenantId: undefined, status: undefined })
    const listing = allListings.find((l) => l.id === listingId) || null
    const ref = await addDoc(collection(this.db, MODERATION_COLLECTION), {
      tenantId: listing?.tenantId || "",
      listingId,
      action: "flagged",
      reason,
      performedBy,
      performedById,
      createdAt: new Date().toISOString(),
    })
    await updateDoc(doc(this.db, LISTINGS_COLLECTION, listingId), {
      status: "rejected",
      updatedAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return toModerationRecord(snap.id, snap.data() as Record<string, unknown>)
  }

  async suspendListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord> {
    const allListings = await this.getAllListings({ tenantId: undefined, status: undefined })
    const listing = allListings.find((l) => l.id === listingId) || null
    const ref = await addDoc(collection(this.db, MODERATION_COLLECTION), {
      tenantId: listing?.tenantId || "",
      listingId,
      action: "suspended",
      reason,
      performedBy,
      performedById,
      createdAt: new Date().toISOString(),
    })
    await updateDoc(doc(this.db, LISTINGS_COLLECTION, listingId), {
      status: "archived",
      updatedAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return toModerationRecord(snap.id, snap.data() as Record<string, unknown>)
  }

  async removeListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord> {
    const allListings = await this.getAllListings({ tenantId: undefined, status: undefined })
    const listing = allListings.find((l) => l.id === listingId) || null
    const ref = await addDoc(collection(this.db, MODERATION_COLLECTION), {
      tenantId: listing?.tenantId || "",
      listingId,
      action: "removed",
      reason,
      performedBy,
      performedById,
      createdAt: new Date().toISOString(),
    })
    await updateDoc(doc(this.db, LISTINGS_COLLECTION, listingId), {
      status: "archived",
      updatedAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return toModerationRecord(snap.id, snap.data() as Record<string, unknown>)
  }

  async getModerationHistory(listingId?: string): Promise<MarketplaceModerationRecord[]> {
    const col = collection(this.db, MODERATION_COLLECTION)
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")]
    if (listingId) constraints.unshift(where("listingId", "==", listingId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toModerationRecord(d.id, d.data() as Record<string, unknown>))
  }
}
