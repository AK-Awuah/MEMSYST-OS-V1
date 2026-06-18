import {
  collection, getDocs, query, where, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMarketplaceAnalyticsService } from "./IMarketplaceAnalyticsService"
import type { MarketplaceAnalytics, MarketplaceListing, BusinessProfile, Opportunity } from "@/types"

function extractListings(snap: { docs: { id: string; data: () => Record<string, unknown> }[] }): MarketplaceListing[] {
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      tenantId: (data.tenantId as string) || "",
      memberId: (data.memberId as string) || "",
      listingType: (data.listingType as MarketplaceListing["listingType"]) || "product",
      title: (data.title as string) || "",
      description: (data.description as string) || "",
      status: (data.status as MarketplaceListing["status"]) || "draft",
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
    } as MarketplaceListing
  })
}

function extractBusinessProfiles(snap: { docs: { id: string; data: () => Record<string, unknown> }[] }): BusinessProfile[] {
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      tenantId: (data.tenantId as string) || "",
      memberId: (data.memberId as string) || "",
      businessName: (data.businessName as string) || "",
      categoryId: (data.categoryId as string) || "",
      description: (data.description as string) || "",
      status: (data.status as BusinessProfile["status"]) || "active",
      verificationStatus: (data.verificationStatus as BusinessProfile["verificationStatus"]) || "unverified",
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
    } as BusinessProfile
  })
}

function extractOpportunities(snap: { docs: { id: string; data: () => Record<string, unknown> }[] }): Opportunity[] {
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      tenantId: (data.tenantId as string) || "",
      memberId: (data.memberId as string) || "",
      opportunityType: (data.opportunityType as Opportunity["opportunityType"]) || "employment",
      title: (data.title as string) || "",
      description: (data.description as string) || "",
      requirements: (data.requirements as string[]) || [],
      location: (data.location as string) || "",
      applicationDeadline: data.applicationDeadline as string | undefined,
      status: (data.status as Opportunity["status"]) || "open",
      viewCount: (data.viewCount as number) || 0,
      applicationCount: (data.applicationCount as number) || 0,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
    } as Opportunity
  })
}

export class FirebaseMarketplaceAnalyticsService implements IMarketplaceAnalyticsService {
  private db = getFirestoreDb()

  async getAnalytics(tenantId?: string): Promise<MarketplaceAnalytics> {
    const db = this.db

    const [listingSnap, businessSnap, oppSnap, approvalsSnap] = await Promise.all([
      getDocs(collection(db, "marketplaceListings")),
      getDocs(collection(db, "businessProfiles")),
      getDocs(collection(db, "opportunities")),
      getDocs(query(collection(db, "marketplaceApprovals"), where("status", "==", "pending"))),
    ])

    const listings = extractListings(listingSnap)
    const businesses = extractBusinessProfiles(businessSnap)
    const opportunities = extractOpportunities(oppSnap)

    const tenantListings = tenantId ? listings.filter((l) => l.tenantId === tenantId) : listings
    const tenantBusinesses = tenantId ? businesses.filter((b) => b.tenantId === tenantId) : businesses
    const tenantOpportunities = tenantId ? opportunities.filter((o) => o.tenantId === tenantId) : opportunities

    const totalListings = tenantListings.length
    const activeListings = tenantListings.filter((l) => l.status === "active").length
    const totalBusinessProfiles = tenantBusinesses.length
    const verifiedBusinesses = tenantBusinesses.filter((b) => b.verificationStatus === "verified").length
    const totalOpportunities = tenantOpportunities.length
    const openOpportunities = tenantOpportunities.filter((o) => o.status === "open").length
    const totalListingViews = tenantListings.reduce((sum, l) => sum + (l.viewCount || 0), 0)

    const uniqueMembers = new Set<string>()
    tenantListings.forEach((l) => uniqueMembers.add(l.memberId))
    tenantBusinesses.forEach((b) => uniqueMembers.add(b.memberId))
    tenantOpportunities.forEach((o) => uniqueMembers.add(o.memberId))

    const pendingApprovals = approvalsSnap.docs.length

    const byListingTypeMap = new Map<string, number>()
    tenantListings.forEach((l) => {
      byListingTypeMap.set(l.listingType, (byListingTypeMap.get(l.listingType) || 0) + 1)
    })
    const byListingType = Array.from(byListingTypeMap.entries()).map(([type, count]) => ({ type, count }))

    const byStatusMap = new Map<string, number>()
    tenantListings.forEach((l) => {
      byStatusMap.set(l.status, (byStatusMap.get(l.status) || 0) + 1)
    })
    const byStatus = Array.from(byStatusMap.entries()).map(([status, count]) => ({ status, count }))

    const byTenantMap = new Map<string, number>()
    listings.forEach((l) => {
      byTenantMap.set(l.tenantId, (byTenantMap.get(l.tenantId) || 0) + 1)
    })
    const byTenant = Array.from(byTenantMap.entries()).map(([tenantId, count]) => ({ tenantId, count }))

    const activityMap = new Map<string, { listings: number; businesses: number }>()
    listings.forEach((l) => {
      const day = l.createdAt?.substring(0, 10) || "unknown"
      const entry = activityMap.get(day) || { listings: 0, businesses: 0 }
      entry.listings++
      activityMap.set(day, entry)
    })
    businesses.forEach((b) => {
      const day = b.createdAt?.substring(0, 10) || "unknown"
      const entry = activityMap.get(day) || { listings: 0, businesses: 0 }
      entry.businesses++
      activityMap.set(day, entry)
    })
    const recentActivity = Array.from(activityMap.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 30)
      .map(([date, data]) => ({ date, ...data }))

    return {
      totalListings,
      activeListings,
      totalBusinessProfiles,
      verifiedBusinesses,
      totalOpportunities,
      openOpportunities,
      totalListingViews,
      memberParticipation: uniqueMembers.size,
      pendingApprovals,
      byListingType,
      byStatus,
      byTenant,
      recentActivity,
    }
  }

  async getTenantAnalytics(tenantId: string): Promise<MarketplaceAnalytics> {
    return this.getAnalytics(tenantId)
  }

  async getPlatformAnalytics(): Promise<MarketplaceAnalytics> {
    return this.getAnalytics()
  }
}
