import type { ICRMService } from "./ICRMService"
import type { CRMOpportunity, CRMStage, Activity } from "@/types"

export class FirebaseCRMService implements ICRMService {
  async listOpportunities(): Promise<CRMOpportunity[]> { return [] }
  async getOpportunity(_id: string): Promise<CRMOpportunity | null> { return null }
  async createOpportunity(_data: Omit<CRMOpportunity, "id" | "activities" | "createdAt" | "updatedAt">): Promise<CRMOpportunity> { throw new Error("Firebase not configured") }
  async updateStage(_id: string, _stage: CRMStage): Promise<void> {}
  async updateOpportunity(_id: string, _data: Partial<CRMOpportunity>): Promise<void> {}
  async addActivity(_id: string, _activity: Omit<Activity, "id" | "createdAt">): Promise<void> {}
  async getPipelineStats(): Promise<Record<CRMStage, number>> { return {} as Record<CRMStage, number> }
}
