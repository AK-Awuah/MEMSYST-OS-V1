import type { MarketplaceListing, MarketplaceListingStatus } from "@/types"

export interface IMarketplaceListingService {
  listListings(tenantId: string, params?: { status?: MarketplaceListingStatus; listingType?: string; memberId?: string }): Promise<MarketplaceListing[]>
  getListing(id: string): Promise<MarketplaceListing | null>
  createListing(data: Omit<MarketplaceListing, "id" | "createdAt" | "updatedAt" | "viewCount">): Promise<MarketplaceListing>
  updateListing(id: string, data: Partial<MarketplaceListing>): Promise<MarketplaceListing>
  updateListingStatus(id: string, status: MarketplaceListingStatus): Promise<MarketplaceListing>
  deleteListing(id: string): Promise<void>
  incrementViewCount(id: string): Promise<void>
  getListingsByMember(memberId: string, tenantId: string): Promise<MarketplaceListing[]>
}
