import type { MarketplaceListing, MarketplaceModerationRecord } from "@/types"

export interface IMarketplaceComplianceService {
  getAllListings(params?: { tenantId?: string; status?: string }): Promise<MarketplaceListing[]>
  flagListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord>
  suspendListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord>
  removeListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord>
  getModerationHistory(listingId?: string): Promise<MarketplaceModerationRecord[]>
}
