import type { IMarketplaceComplianceService } from "./IMarketplaceComplianceService"
import type { MarketplaceListing, MarketplaceModerationRecord } from "@/types"
import { mockMarketplaceListings, mockMarketplaceModerationRecords } from "./mock-data"
import { delay } from "./shared-store"

export class MockMarketplaceComplianceService implements IMarketplaceComplianceService {
  private listings = [...mockMarketplaceListings]
  private moderationHistory = [...mockMarketplaceModerationRecords]

  async getAllListings(params?: { tenantId?: string; status?: string }): Promise<MarketplaceListing[]> {
    await delay(200)
    let result = [...this.listings]
    if (params?.tenantId) result = result.filter((l) => l.tenantId === params.tenantId)
    if (params?.status) result = result.filter((l) => l.status === params.status)
    return result
  }

  async flagListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord> {
    await delay(150)
    const record: MarketplaceModerationRecord = {
      id: `mmr-${Date.now()}`,
      tenantId: this.listings.find((l) => l.id === listingId)?.tenantId || "",
      listingId,
      action: "flagged",
      reason,
      performedBy,
      performedById,
      createdAt: new Date().toISOString(),
    }
    this.moderationHistory.push(record)
    return record
  }

  async suspendListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord> {
    await delay(150)
    const record: MarketplaceModerationRecord = {
      id: `mmr-${Date.now()}`,
      tenantId: this.listings.find((l) => l.id === listingId)?.tenantId || "",
      listingId,
      action: "suspended",
      reason,
      performedBy,
      performedById,
      createdAt: new Date().toISOString(),
    }
    this.moderationHistory.push(record)
    const idx = this.listings.findIndex((l) => l.id === listingId)
    if (idx !== -1) {
      this.listings[idx] = { ...this.listings[idx], status: "archived", updatedAt: new Date().toISOString() }
    }
    return record
  }

  async removeListing(listingId: string, reason: string, performedBy: string, performedById: string): Promise<MarketplaceModerationRecord> {
    await delay(150)
    const record: MarketplaceModerationRecord = {
      id: `mmr-${Date.now()}`,
      tenantId: this.listings.find((l) => l.id === listingId)?.tenantId || "",
      listingId,
      action: "removed",
      reason,
      performedBy,
      performedById,
      createdAt: new Date().toISOString(),
    }
    this.moderationHistory.push(record)
    this.listings = this.listings.filter((l) => l.id !== listingId)
    return record
  }

  async getModerationHistory(listingId?: string): Promise<MarketplaceModerationRecord[]> {
    await delay(100)
    if (listingId) return this.moderationHistory.filter((r) => r.listingId === listingId)
    return [...this.moderationHistory]
  }
}
