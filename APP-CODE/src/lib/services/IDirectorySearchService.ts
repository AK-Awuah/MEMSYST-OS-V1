import type { MarketplaceListing, BusinessProfile, Opportunity } from "@/types"

export interface SearchFilters {
  query?: string
  categoryId?: string
  region?: string
  branch?: string
  location?: string
  membershipCategory?: string
  businessType?: string
  tenantId: string
}

export interface SearchResults {
  listings: MarketplaceListing[]
  businesses: BusinessProfile[]
  opportunities: Opportunity[]
  totalResults: number
}

export interface IDirectorySearchService {
  searchAll(filters: SearchFilters): Promise<SearchResults>
  searchListings(filters: SearchFilters): Promise<MarketplaceListing[]>
  searchBusinesses(filters: SearchFilters): Promise<BusinessProfile[]>
  searchOpportunities(filters: SearchFilters): Promise<Opportunity[]>
}
