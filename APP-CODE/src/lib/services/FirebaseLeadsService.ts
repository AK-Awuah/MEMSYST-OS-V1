import type { ILeadsService } from "./ILeadsService"
import type { Lead, Activity, LeadStatus } from "@/types"

export class FirebaseLeadsService implements ILeadsService {
  async listLeads(): Promise<Lead[]> { return [] }
  async getLead(_id: string): Promise<Lead | null> { return null }
  async createLead(_data: Omit<Lead, "id" | "activities" | "attachments" | "createdAt" | "updatedAt">): Promise<Lead> { throw new Error("Firebase not configured") }
  async updateLead(_id: string, _data: Partial<Lead>): Promise<void> {}
  async updateStatus(_id: string, _status: LeadStatus): Promise<void> {}
  async assignLead(_id: string, _userId: string): Promise<void> {}
  async addActivity(_id: string, _activity: Omit<Activity, "id" | "createdAt">): Promise<void> {}
  async getLeadStats(): Promise<{ total: number; new: number; qualified: number; won: number; lost: number }> {
    return { total: 0, new: 0, qualified: 0, won: 0, lost: 0 }
  }
}
