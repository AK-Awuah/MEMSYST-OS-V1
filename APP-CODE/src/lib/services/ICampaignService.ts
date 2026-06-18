import type { Campaign } from "@/types"

export interface ICampaignService {
  createCampaign(tenantId: string, data: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "sentCount" | "deliveredCount" | "openedCount" | "clickedCount" | "failedCount" | "totalCost" | "totalCharge">): Promise<Campaign>
  updateCampaign(tenantId: string, id: string, data: Partial<Campaign>): Promise<Campaign>
  launchCampaign(tenantId: string, id: string): Promise<Campaign>
  cancelCampaign(tenantId: string, id: string): Promise<Campaign>
  listCampaigns(tenantId: string, filters?: { status?: string; type?: string }): Promise<Campaign[]>
  getCampaignById(id: string): Promise<Campaign | null>
  getCampaignAnalytics(tenantId: string, id: string): Promise<{ sent: number; delivered: number; opened: number; clicked: number; failed: number; engagementRate: number }>
}
