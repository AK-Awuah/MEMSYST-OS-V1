import type { Lead, Activity, LeadStatus } from "@/types"

export interface ILeadsService {
  listLeads(params?: {
    status?: LeadStatus
    assignedTo?: string
    search?: string
  }): Promise<Lead[]>
  getLead(id: string): Promise<Lead | null>
  createLead(data: Omit<Lead, "id" | "activities" | "attachments" | "createdAt" | "updatedAt">): Promise<Lead>
  updateLead(id: string, data: Partial<Lead>): Promise<void>
  updateStatus(id: string, status: LeadStatus): Promise<void>
  assignLead(id: string, userId: string): Promise<void>
  addActivity(id: string, activity: Omit<Activity, "id" | "createdAt">): Promise<void>
  getLeadStats(): Promise<{
    total: number
    new: number
    qualified: number
    won: number
    lost: number
  }>
}
