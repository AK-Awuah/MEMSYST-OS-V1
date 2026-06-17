import type { CRMOpportunity, CRMStage, Activity } from "@/types"

export interface ICRMService {
  listOpportunities(params?: {
    stage?: CRMStage
    assignedTo?: string
  }): Promise<CRMOpportunity[]>
  getOpportunity(id: string): Promise<CRMOpportunity | null>
  createOpportunity(data: Omit<CRMOpportunity, "id" | "activities" | "createdAt" | "updatedAt">): Promise<CRMOpportunity>
  updateStage(id: string, stage: CRMStage): Promise<void>
  updateOpportunity(id: string, data: Partial<CRMOpportunity>): Promise<void>
  addActivity(id: string, activity: Omit<Activity, "id" | "createdAt">): Promise<void>
  getPipelineStats(): Promise<Record<CRMStage, number>>
}
