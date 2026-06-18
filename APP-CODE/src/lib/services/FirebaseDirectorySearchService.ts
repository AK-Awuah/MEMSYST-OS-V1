import {
  collection, getDocs, query, where, orderBy, Timestamp,
} from "firebase/firestore"
import type { QueryConstraint } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IDirectorySearchService, SearchFilters, SearchResults } from "./IDirectorySearchService"
import type {
  MarketplaceListing, MarketplaceListingStatus, MarketplaceListingType,
  BusinessProfile, BusinessVerificationStatus,
  Opportunity, OpportunityType, OpportunityStatus,
} from "@/types"

function toListing(id: string, data: Record<string, unknown>): MarketplaceListing {
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

function toBusinessProfile(id: string, data: Record<string, unknown>): BusinessProfile {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    businessName: (data.businessName as string) || "",
    categoryId: (data.categoryId as string) || "",
    description: (data.description as string) || "",
    status: (data.status as BusinessProfile["status"]) || "active",
    verificationStatus: (data.verificationStatus as BusinessVerificationStatus) || "unverified",
    verificationType: data.verificationType as BusinessProfile["verificationType"],
    verifiedAt: data.verifiedAt as string | undefined,
    verifiedBy: data.verifiedBy as string | undefined,
    address: (data.address as string) || "",
    phone: (data.phone as string) || "",
    email: (data.email as string) || "",
    website: (data.website as string) || "",
    socialMedia: (data.socialMedia as string[]) || [],
    operatingHours: (data.operatingHours as Record<string, string>) || {},
    logo: (data.logo as string) || "",
    gallery: (data.gallery as string[]) || [],
    promotionalImages: (data.promotionalImages as string[]) || [],
    services: (data.services as string[]) || [],
    products: (data.products as string[]) || [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

function toOpportunity(id: string, data: Record<string, unknown>): Opportunity {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    opportunityType: (data.opportunityType as OpportunityType) || "employment",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    requirements: (data.requirements as string[]) || [],
    location: (data.location as string) || "",
    applicationDeadline: data.applicationDeadline as string | undefined,
    status: (data.status as OpportunityStatus) || "open",
    viewCount: (data.viewCount as number) || 0,
    applicationCount: (data.applicationCount as number) || 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseDirectorySearchService implements IDirectorySearchService {
  private db = getFirestoreDb()

  async searchAll(filters: SearchFilters): Promise<SearchResults> {
    const [listings, businesses, opportunities] = await Promise.all([
      this.searchListings(filters),
      this.searchBusinesses(filters),
      this.searchOpportunities(filters),
    ])

    const totalResults = listings.length + businesses.length + opportunities.length

    return { listings, businesses, opportunities, totalResults }
  }

  async searchListings(filters: SearchFilters): Promise<MarketplaceListing[]> {
    const col = collection(this.db, "marketplaceListings")
    const constraints: QueryConstraint[] = []

    constraints.push(where("tenantId", "==", filters.tenantId))
    if (filters.categoryId) constraints.push(where("categoryId", "==", filters.categoryId))

    constraints.push(orderBy("createdAt", "desc"))

    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toListing(d.id, d.data() as Record<string, unknown>))

    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q),
      )
    }

    return results
  }

  async searchBusinesses(filters: SearchFilters): Promise<BusinessProfile[]> {
    const col = collection(this.db, "businessProfiles")
    const constraints: QueryConstraint[] = []

    constraints.push(where("tenantId", "==", filters.tenantId))
    if (filters.categoryId) constraints.push(where("categoryId", "==", filters.categoryId))

    constraints.push(orderBy("createdAt", "desc"))

    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toBusinessProfile(d.id, d.data() as Record<string, unknown>))

    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(
        (b) => b.businessName.toLowerCase().includes(q) || b.description.toLowerCase().includes(q),
      )
    }

    return results
  }

  async searchOpportunities(filters: SearchFilters): Promise<Opportunity[]> {
    const col = collection(this.db, "opportunities")
    const constraints: QueryConstraint[] = []

    constraints.push(where("tenantId", "==", filters.tenantId))

    constraints.push(orderBy("createdAt", "desc"))

    const snap = await getDocs(query(col, ...constraints))
    let results = snap.docs.map((d) => toOpportunity(d.id, d.data() as Record<string, unknown>))

    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(
        (o) => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q),
      )
    }

    return results
  }
}
