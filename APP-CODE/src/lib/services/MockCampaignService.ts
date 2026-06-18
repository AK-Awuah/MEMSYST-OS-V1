import { delay } from "./shared-store"
import { mockCampaigns } from "./mock-data"
import type { Campaign } from "@/types"
import type { ICampaignService } from "./ICampaignService"

export class MockCampaignService implements ICampaignService {
  private items = [...mockCampaigns]

  async createCampaign(tenantId: string, data: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "sentCount" | "deliveredCount" | "openedCount" | "clickedCount" | "failedCount" | "totalCost" | "totalCharge">): Promise<Campaign> {
    await delay(300)
    const item: Campaign = {
      ...data,
      id: `camp-${Date.now()}`,
      tenantId,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      failedCount: 0,
      totalCost: 0,
      totalCharge: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async updateCampaign(tenantId: string, id: string, data: Partial<Campaign>): Promise<Campaign> {
    await delay(200)
    const idx = this.items.findIndex((c) => c.id === id && c.tenantId === tenantId)
    if (idx === -1) throw new Error(`Campaign ${id} not found`)
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async launchCampaign(tenantId: string, id: string): Promise<Campaign> {
    await delay(300)
    const idx = this.items.findIndex((c) => c.id === id && c.tenantId === tenantId)
    if (idx === -1) throw new Error(`Campaign ${id} not found`)
    this.items[idx] = { ...this.items[idx], status: "running", updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async cancelCampaign(tenantId: string, id: string): Promise<Campaign> {
    await delay(200)
    const idx = this.items.findIndex((c) => c.id === id && c.tenantId === tenantId)
    if (idx === -1) throw new Error(`Campaign ${id} not found`)
    this.items[idx] = { ...this.items[idx], status: "cancelled", updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async listCampaigns(tenantId: string, filters?: { status?: string; type?: string }): Promise<Campaign[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (filters?.status) result = result.filter((c) => c.status === filters.status)
    if (filters?.type) result = result.filter((c) => c.type === filters.type)
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async getCampaignAnalytics(tenantId: string, id: string): Promise<{ sent: number; delivered: number; opened: number; clicked: number; failed: number; engagementRate: number }> {
    await delay(200)
    const campaign = this.items.find((c) => c.id === id && c.tenantId === tenantId)
    if (!campaign) return { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, engagementRate: 0 }
    const engagementRate = campaign.deliveredCount > 0 ? Math.round((campaign.openedCount / campaign.deliveredCount) * 10000) / 100 : 0
    return {
      sent: campaign.sentCount,
      delivered: campaign.deliveredCount,
      opened: campaign.openedCount,
      clicked: campaign.clickedCount,
      failed: campaign.failedCount,
      engagementRate,
    }
  }
}
