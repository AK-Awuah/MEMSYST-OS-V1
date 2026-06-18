import type { IMarketplaceListingService } from "./IMarketplaceListingService"
import type { MarketplaceListing, MarketplaceListingStatus } from "@/types"
import { mockMarketplaceListings } from "./mock-data"
import { delay } from "./shared-store"

export class MockMarketplaceListingService implements IMarketplaceListingService {
  private items = [...mockMarketplaceListings]

  async listListings(tenantId: string, params?: { status?: MarketplaceListingStatus; listingType?: string; memberId?: string }): Promise<MarketplaceListing[]> {
    await delay(200)
    let result = this.items.filter((l) => l.tenantId === tenantId)
    if (params?.status) result = result.filter((l) => l.status === params.status)
    if (params?.listingType) result = result.filter((l) => l.listingType === params.listingType)
    if (params?.memberId) result = result.filter((l) => l.memberId === params.memberId)
    return result
  }

  async getListing(id: string): Promise<MarketplaceListing | null> {
    await delay(100)
    return this.items.find((l) => l.id === id) || null
  }

  async createListing(data: Omit<MarketplaceListing, "id" | "createdAt" | "updatedAt" | "viewCount">): Promise<MarketplaceListing> {
    await delay(200)
    const listing: MarketplaceListing = {
      ...data,
      id: `ml-${Date.now()}`,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(listing)
    return listing
  }

  async updateListing(id: string, data: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    await delay(150)
    const idx = this.items.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error("Listing not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateListingStatus(id: string, status: MarketplaceListingStatus): Promise<MarketplaceListing> {
    await delay(100)
    const idx = this.items.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error("Listing not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteListing(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((l) => l.id !== id)
  }

  async incrementViewCount(id: string): Promise<void> {
    await delay(100)
    const idx = this.items.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error("Listing not found")
    this.items[idx] = { ...this.items[idx], viewCount: this.items[idx].viewCount + 1, updatedAt: new Date().toISOString() }
  }

  async getListingsByMember(memberId: string, tenantId: string): Promise<MarketplaceListing[]> {
    await delay(100)
    return this.items.filter((l) => l.memberId === memberId && l.tenantId === tenantId)
  }
}
