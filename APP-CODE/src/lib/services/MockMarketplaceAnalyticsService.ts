import type { IMarketplaceAnalyticsService } from "./IMarketplaceAnalyticsService"
import type { MarketplaceAnalytics } from "@/types"
import { mockMarketplaceListings, mockBusinessProfiles, mockMarketplaceOpportunities, mockMarketplaceApprovals } from "./mock-data"
import { delay } from "./shared-store"

export class MockMarketplaceAnalyticsService implements IMarketplaceAnalyticsService {
  private computeAnalytics(tenantId?: string): MarketplaceAnalytics {
    const listings = tenantId
      ? mockMarketplaceListings.filter((l) => l.tenantId === tenantId)
      : mockMarketplaceListings
    const businesses = tenantId
      ? mockBusinessProfiles.filter((b) => b.tenantId === tenantId)
      : mockBusinessProfiles
    const opportunities = tenantId
      ? mockMarketplaceOpportunities.filter((o) => o.tenantId === tenantId)
      : mockMarketplaceOpportunities
    const approvals = tenantId
      ? mockMarketplaceApprovals.filter((a) => a.tenantId === tenantId)
      : mockMarketplaceApprovals

    const typeMap: Record<string, number> = {}
    const statusMap: Record<string, number> = {}
    listings.forEach((l) => {
      typeMap[l.listingType] = (typeMap[l.listingType] || 0) + 1
      statusMap[l.status] = (statusMap[l.status] || 0) + 1
    })

    const tenantMap: Record<string, number> = {}
    mockMarketplaceListings.forEach((l) => {
      tenantMap[l.tenantId] = (tenantMap[l.tenantId] || 0) + 1
    })

    const today = new Date().toISOString().slice(0, 10)
    const recentActivity = [
      { date: today, listings: listings.length, businesses: businesses.length },
    ]

    return {
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === "active").length,
      totalBusinessProfiles: businesses.length,
      verifiedBusinesses: businesses.filter((b) => b.verificationStatus === "verified").length,
      totalOpportunities: opportunities.length,
      openOpportunities: opportunities.filter((o) => o.status === "open").length,
      totalListingViews: listings.reduce((sum, l) => sum + l.viewCount, 0),
      memberParticipation: new Set(listings.map((l) => l.memberId)).size,
      pendingApprovals: approvals.filter((a) => a.status === "pending").length,
      byListingType: Object.entries(typeMap).map(([type, count]) => ({ type, count })),
      byStatus: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      byTenant: Object.entries(tenantMap).map(([tenantId, count]) => ({ tenantId, count })),
      recentActivity,
    }
  }

  async getAnalytics(tenantId?: string): Promise<MarketplaceAnalytics> {
    await delay(200)
    return this.computeAnalytics(tenantId)
  }

  async getTenantAnalytics(tenantId: string): Promise<MarketplaceAnalytics> {
    await delay(200)
    return this.computeAnalytics(tenantId)
  }

  async getPlatformAnalytics(): Promise<MarketplaceAnalytics> {
    await delay(200)
    return this.computeAnalytics()
  }
}
