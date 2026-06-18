import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp, increment,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMarketplaceListingService } from "./IMarketplaceListingService"
import type { MarketplaceListing, MarketplaceListingStatus, MarketplaceListingType } from "@/types"

const COLLECTION = "marketplaceListings"

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

export class FirebaseMarketplaceListingService implements IMarketplaceListingService {
  private db = getFirestoreDb()

  async listListings(tenantId: string, params?: {
    status?: MarketplaceListingStatus
    listingType?: string
    memberId?: string
  }): Promise<MarketplaceListing[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.listingType) constraints.unshift(where("listingType", "==", params.listingType))
    if (params?.memberId) constraints.unshift(where("memberId", "==", params.memberId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toMarketplaceListing(d.id, d.data() as Record<string, unknown>))
  }

  async getListing(id: string): Promise<MarketplaceListing | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toMarketplaceListing(snap.id, snap.data() as Record<string, unknown>)
  }

  async createListing(data: Omit<MarketplaceListing, "id" | "createdAt" | "updatedAt" | "viewCount">): Promise<MarketplaceListing> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getListing(ref.id) as Promise<MarketplaceListing>
  }

  async updateListing(id: string, data: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getListing(id) as Promise<MarketplaceListing>
  }

  async updateListingStatus(id: string, status: MarketplaceListingStatus): Promise<MarketplaceListing> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
    return this.getListing(id) as Promise<MarketplaceListing>
  }

  async deleteListing(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }

  async incrementViewCount(id: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      viewCount: increment(1),
      updatedAt: new Date().toISOString(),
    })
  }

  async getListingsByMember(memberId: string, tenantId: string): Promise<MarketplaceListing[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toMarketplaceListing(d.id, d.data() as Record<string, unknown>))
  }
}
