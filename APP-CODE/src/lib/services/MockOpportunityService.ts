import type { IOpportunityService } from "./IOpportunityService"
import type { Opportunity, OpportunityStatus, OpportunityApplication } from "@/types"
import { mockMarketplaceOpportunities, mockMarketplaceOpportunityApplications } from "./mock-data"
import { delay } from "./shared-store"

export class MockOpportunityService implements IOpportunityService {
  private items = [...mockMarketplaceOpportunities]
  private applications = [...mockMarketplaceOpportunityApplications]

  async listOpportunities(tenantId: string, params?: { status?: OpportunityStatus; opportunityType?: string }): Promise<Opportunity[]> {
    await delay(200)
    let result = this.items.filter((o) => o.tenantId === tenantId)
    if (params?.status) result = result.filter((o) => o.status === params.status)
    if (params?.opportunityType) result = result.filter((o) => o.opportunityType === params.opportunityType)
    return result
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    await delay(100)
    return this.items.find((o) => o.id === id) || null
  }

  async createOpportunity(data: Omit<Opportunity, "id" | "createdAt" | "updatedAt" | "viewCount" | "applicationCount">): Promise<Opportunity> {
    await delay(200)
    const opportunity: Opportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      viewCount: 0,
      applicationCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(opportunity)
    return opportunity
  }

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    await delay(150)
    const idx = this.items.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Opportunity not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateOpportunityStatus(id: string, status: OpportunityStatus): Promise<Opportunity> {
    await delay(100)
    const idx = this.items.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Opportunity not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteOpportunity(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((o) => o.id !== id)
  }

  async applyToOpportunity(data: Omit<OpportunityApplication, "id" | "createdAt">): Promise<OpportunityApplication> {
    await delay(200)
    const application: OpportunityApplication = {
      ...data,
      id: `oa-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.applications.push(application)
    const oppIdx = this.items.findIndex((o) => o.id === data.opportunityId)
    if (oppIdx !== -1) {
      this.items[oppIdx] = { ...this.items[oppIdx], applicationCount: this.items[oppIdx].applicationCount + 1, updatedAt: new Date().toISOString() }
    }
    return application
  }

  async getApplications(opportunityId: string): Promise<OpportunityApplication[]> {
    await delay(100)
    return this.applications.filter((a) => a.opportunityId === opportunityId)
  }

  async updateApplicationStatus(id: string, status: string): Promise<OpportunityApplication> {
    await delay(100)
    const idx = this.applications.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Application not found")
    this.applications[idx] = { ...this.applications[idx], status: status as OpportunityApplication["status"] }
    return this.applications[idx]
  }
}
