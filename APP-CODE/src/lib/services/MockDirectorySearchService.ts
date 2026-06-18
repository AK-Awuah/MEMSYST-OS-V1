import type { IDirectorySearchService, SearchFilters, SearchResults } from "./IDirectorySearchService"
import type { MarketplaceListing, BusinessProfile, Opportunity } from "@/types"
import { mockMarketplaceListings, mockBusinessProfiles, mockMarketplaceOpportunities } from "./mock-data"
import { delay } from "./shared-store"

export class MockDirectorySearchService implements IDirectorySearchService {
  private listings = [...mockMarketplaceListings]
  private businesses = [...mockBusinessProfiles]
  private opportunities = [...mockMarketplaceOpportunities]

  private filterListings(filters: SearchFilters): MarketplaceListing[] {
    let result = this.listings.filter((l) => l.tenantId === filters.tenantId)
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
    }
    if (filters.categoryId) result = result.filter((l) => l.categoryId === filters.categoryId)
    if (filters.location) result = result.filter((l) => l.location?.toLowerCase().includes(filters.location!.toLowerCase()))
    return result
  }

  private filterBusinesses(filters: SearchFilters): BusinessProfile[] {
    let result = this.businesses.filter((b) => b.tenantId === filters.tenantId)
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter((b) => b.businessName.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))
    }
    if (filters.categoryId) result = result.filter((b) => b.categoryId === filters.categoryId)
    if (filters.location) result = result.filter((b) => b.address.toLowerCase().includes(filters.location!.toLowerCase()))
    return result
  }

  private filterOpportunities(filters: SearchFilters): Opportunity[] {
    let result = this.opportunities.filter((o) => o.tenantId === filters.tenantId)
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter((o) => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q))
    }
    if (filters.location) result = result.filter((o) => o.location.toLowerCase().includes(filters.location!.toLowerCase()))
    return result
  }

  async searchAll(filters: SearchFilters): Promise<SearchResults> {
    await delay(300)
    const listings = this.filterListings(filters)
    const businesses = this.filterBusinesses(filters)
    const opportunities = this.filterOpportunities(filters)
    return {
      listings,
      businesses,
      opportunities,
      totalResults: listings.length + businesses.length + opportunities.length,
    }
  }

  async searchListings(filters: SearchFilters): Promise<MarketplaceListing[]> {
    await delay(200)
    return this.filterListings(filters)
  }

  async searchBusinesses(filters: SearchFilters): Promise<BusinessProfile[]> {
    await delay(200)
    return this.filterBusinesses(filters)
  }

  async searchOpportunities(filters: SearchFilters): Promise<Opportunity[]> {
    await delay(200)
    return this.filterOpportunities(filters)
  }
}
