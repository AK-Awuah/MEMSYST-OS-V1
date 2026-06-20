import type { Advertisement, AdCampaign, SponsorDeal, AdvertisingAuditLog } from "@/types"

export interface IAdvertisingService {
  listAds(tenantId: string, params?: { status?: string; placement?: string }): Promise<Advertisement[]>
  getAd(id: string): Promise<Advertisement | null>
  createAd(tenantId: string, data: Omit<Advertisement, "id" | "createdAt" | "updatedAt" | "impressions" | "clicks" | "conversions" | "spentBudget">): Promise<Advertisement>
  updateAd(id: string, data: Partial<Advertisement>): Promise<void>
  approveAd(id: string, reviewedBy: string, reviewNotes?: string): Promise<void>
  rejectAd(id: string, reviewedBy: string, reviewNotes: string): Promise<void>
  pauseAd(id: string): Promise<void>
  submitAd(id: string): Promise<void>
  listCampaigns(tenantId: string): Promise<AdCampaign[]>
  getCampaign(id: string): Promise<AdCampaign | null>
  createCampaign(tenantId: string, data: Omit<AdCampaign, "id" | "createdAt" | "updatedAt" | "spentBudget" | "performance">): Promise<AdCampaign>
  updateCampaign(id: string, data: Partial<AdCampaign>): Promise<void>
  launchCampaign(id: string): Promise<void>
  completeCampaign(id: string): Promise<void>
  listSponsors(tenantId: string): Promise<SponsorDeal[]>
  getSponsor(id: string): Promise<SponsorDeal | null>
  createSponsor(tenantId: string, data: Omit<SponsorDeal, "id" | "createdAt" | "updatedAt">): Promise<SponsorDeal>
  updateSponsor(id: string, data: Partial<SponsorDeal>): Promise<void>
  getAuditLogs(tenantId: string): Promise<AdvertisingAuditLog[]>
}
