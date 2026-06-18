import type { Opportunity, OpportunityStatus, OpportunityApplication } from "@/types"

export interface IOpportunityService {
  listOpportunities(tenantId: string, params?: { status?: OpportunityStatus; opportunityType?: string }): Promise<Opportunity[]>
  getOpportunity(id: string): Promise<Opportunity | null>
  createOpportunity(data: Omit<Opportunity, "id" | "createdAt" | "updatedAt" | "viewCount" | "applicationCount">): Promise<Opportunity>
  updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity>
  updateOpportunityStatus(id: string, status: OpportunityStatus): Promise<Opportunity>
  deleteOpportunity(id: string): Promise<void>
  applyToOpportunity(data: Omit<OpportunityApplication, "id" | "createdAt">): Promise<OpportunityApplication>
  getApplications(opportunityId: string): Promise<OpportunityApplication[]>
  updateApplicationStatus(id: string, status: string): Promise<OpportunityApplication>
}
