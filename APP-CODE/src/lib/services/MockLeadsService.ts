import type { ILeadsService } from "./ILeadsService"
import type { Lead, Activity, LeadStatus } from "@/types"
import { mockLeads, generateMockLead } from "./mock-data"
import { pushAuditLog } from "./shared-store"

const leads = [...mockLeads]

export class MockLeadsService implements ILeadsService {
  async listLeads(): Promise<Lead[]> {
    await delay(300)
    return [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getLead(id: string): Promise<Lead | null> {
    await delay(200)
    return leads.find((l) => l.id === id) || null
  }

  async createLead(data: Omit<Lead, "id" | "activities" | "attachments" | "createdAt" | "updatedAt">): Promise<Lead> {
    await delay(400)
    const lead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      activities: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    leads.push(lead)
    pushAuditLog({ actor: "System", role: "system", action: "create", module: "leads", recordType: "Lead", recordId: lead.id, ipAddress: "", newValue: `Created lead ${lead.organizationName}` })
    return lead
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<void> {
    await delay(300)
    const lead = leads.find((l) => l.id === id)
    if (lead) {
      Object.assign(lead, data, { updatedAt: new Date().toISOString() })
      pushAuditLog({ actor: "System", role: "system", action: "update", module: "leads", recordType: "Lead", recordId: id, ipAddress: "", newValue: `Updated lead ${lead.organizationName}` })
    }
  }

  async updateStatus(id: string, status: LeadStatus): Promise<void> {
    await delay(300)
    const lead = leads.find((l) => l.id === id)
    if (lead) {
      const prev = lead.status
      lead.status = status
      lead.updatedAt = new Date().toISOString()
      pushAuditLog({ actor: "System", role: "system", action: "update_status", module: "leads", recordType: "Lead", recordId: id, ipAddress: "", previousValue: prev, newValue: status })
    }
  }

  async assignLead(id: string, userId: string): Promise<void> {
    await delay(300)
    const lead = leads.find((l) => l.id === id)
    if (lead) {
      const prev = lead.assignedTo || "unassigned"
      lead.assignedTo = userId
      lead.updatedAt = new Date().toISOString()
      pushAuditLog({ actor: "System", role: "system", action: "assign", module: "leads", recordType: "Lead", recordId: id, ipAddress: "", previousValue: prev, newValue: userId })
    }
  }

  async addActivity(id: string, activity: Omit<Activity, "id" | "createdAt">): Promise<void> {
    await delay(200)
    const lead = leads.find((l) => l.id === id)
    if (lead) {
      lead.activities.push({ ...activity, id: `act-${Date.now()}`, createdAt: new Date().toISOString() })
    }
  }

  async getLeadStats(): Promise<{ total: number; new: number; qualified: number; won: number; lost: number }> {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      qualified: leads.filter((l) => l.status === "qualified").length,
      won: leads.filter((l) => l.status === "won").length,
      lost: leads.filter((l) => l.status === "lost").length,
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
