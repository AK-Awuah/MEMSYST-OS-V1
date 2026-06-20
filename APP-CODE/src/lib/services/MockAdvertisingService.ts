import type { IAdvertisingService } from "./IAdvertisingService"
import type { Advertisement, AdCampaign, SponsorDeal, AdvertisingAuditLog } from "@/types"
import { delay, pushAuditLog } from "./shared-store"

let ads: Advertisement[] = []
let campaigns: AdCampaign[] = []
let sponsors: SponsorDeal[] = []

export class MockAdvertisingService implements IAdvertisingService {
  async listAds(tenantId: string, params?: { status?: string; placement?: string }): Promise<Advertisement[]> {
    await delay(200)
    let result = ads.filter((a) => a.tenantId === tenantId)
    if (params?.status) result = result.filter((a) => a.status === params.status)
    if (params?.placement) result = result.filter((a) => a.placement === params.placement)
    return result
  }

  async getAd(id: string): Promise<Advertisement | null> {
    await delay(100)
    return ads.find((a) => a.id === id) || null
  }

  async createAd(tenantId: string, data: Omit<Advertisement, "id" | "createdAt" | "updatedAt" | "impressions" | "clicks" | "conversions" | "spentBudget">): Promise<Advertisement> {
    await delay(200)
    const now = new Date().toISOString()
    const ad: Advertisement = { ...data, id: `ad-${Date.now()}`, tenantId, impressions: 0, clicks: 0, conversions: 0, spentBudget: 0, createdAt: now, updatedAt: now }
    ads.push(ad)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "ADVERTISING", recordType: "Advertisement", recordId: ad.id, newValue: `Ad created: ${ad.title}`, ipAddress: "127.0.0.1" })
    return ad
  }

  async updateAd(id: string, data: Partial<Advertisement>): Promise<void> {
    await delay(150)
    const idx = ads.findIndex((a) => a.id === id)
    if (idx !== -1) ads[idx] = { ...ads[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async approveAd(id: string, reviewedBy: string, reviewNotes?: string): Promise<void> {
    await delay(150)
    const idx = ads.findIndex((a) => a.id === id)
    if (idx !== -1) ads[idx] = { ...ads[idx], status: "approved", reviewedBy, reviewNotes: reviewNotes || "", updatedAt: new Date().toISOString() }
  }

  async rejectAd(id: string, reviewedBy: string, reviewNotes: string): Promise<void> {
    await delay(150)
    const idx = ads.findIndex((a) => a.id === id)
    if (idx !== -1) ads[idx] = { ...ads[idx], status: "rejected", reviewedBy, reviewNotes, updatedAt: new Date().toISOString() }
  }

  async pauseAd(id: string): Promise<void> {
    await delay(100)
    const idx = ads.findIndex((a) => a.id === id)
    if (idx !== -1) ads[idx] = { ...ads[idx], status: "paused", updatedAt: new Date().toISOString() }
  }

  async submitAd(id: string): Promise<void> {
    await delay(100)
    const idx = ads.findIndex((a) => a.id === id)
    if (idx !== -1) ads[idx] = { ...ads[idx], status: "pending_review", updatedAt: new Date().toISOString() }
  }

  async listCampaigns(tenantId: string): Promise<AdCampaign[]> {
    await delay(200)
    return campaigns.filter((c) => c.tenantId === tenantId)
  }

  async getCampaign(id: string): Promise<AdCampaign | null> {
    await delay(100)
    return campaigns.find((c) => c.id === id) || null
  }

  async createCampaign(tenantId: string, data: Omit<AdCampaign, "id" | "createdAt" | "updatedAt" | "spentBudget" | "performance">): Promise<AdCampaign> {
    await delay(200)
    const now = new Date().toISOString()
    const campaign: AdCampaign = { ...data, id: `camp-${Date.now()}`, tenantId, spentBudget: 0, performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversionRate: 0 }, createdAt: now, updatedAt: now }
    campaigns.push(campaign)
    return campaign
  }

  async updateCampaign(id: string, data: Partial<AdCampaign>): Promise<void> {
    await delay(150)
    const idx = campaigns.findIndex((c) => c.id === id)
    if (idx !== -1) campaigns[idx] = { ...campaigns[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async launchCampaign(id: string): Promise<void> {
    await delay(150)
    const idx = campaigns.findIndex((c) => c.id === id)
    if (idx !== -1) campaigns[idx] = { ...campaigns[idx], status: "active", updatedAt: new Date().toISOString() }
  }

  async completeCampaign(id: string): Promise<void> {
    await delay(150)
    const idx = campaigns.findIndex((c) => c.id === id)
    if (idx !== -1) campaigns[idx] = { ...campaigns[idx], status: "completed", updatedAt: new Date().toISOString() }
  }

  async listSponsors(tenantId: string): Promise<SponsorDeal[]> {
    await delay(200)
    return sponsors.filter((s) => s.tenantId === tenantId)
  }

  async getSponsor(id: string): Promise<SponsorDeal | null> {
    await delay(100)
    return sponsors.find((s) => s.id === id) || null
  }

  async createSponsor(tenantId: string, data: Omit<SponsorDeal, "id" | "createdAt" | "updatedAt">): Promise<SponsorDeal> {
    await delay(200)
    const now = new Date().toISOString()
    const sponsor: SponsorDeal = { ...data, id: `spn-${Date.now()}`, tenantId, createdAt: now, updatedAt: now }
    sponsors.push(sponsor)
    return sponsor
  }

  async updateSponsor(id: string, data: Partial<SponsorDeal>): Promise<void> {
    await delay(150)
    const idx = sponsors.findIndex((s) => s.id === id)
    if (idx !== -1) sponsors[idx] = { ...sponsors[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async getAuditLogs(tenantId: string): Promise<AdvertisingAuditLog[]> {
    await delay(100)
    return []
  }
}
