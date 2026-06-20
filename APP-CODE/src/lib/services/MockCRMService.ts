import type { ICRMService } from "./ICRMService"
import type { CRMOpportunity, CRMStage, Activity } from "@/types"
import { mockOpportunities } from "./mock-data"
import { pushAuditLog } from "./shared-store"

const opportunities = [...mockOpportunities]

export class MockCRMService implements ICRMService {
  async listOpportunities(): Promise<CRMOpportunity[]> {
    await delay(300)
    return [...opportunities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getOpportunity(id: string): Promise<CRMOpportunity | null> {
    await delay(200)
    return opportunities.find((o) => o.id === id) || null
  }

  async createOpportunity(data: Omit<CRMOpportunity, "id" | "activities" | "createdAt" | "updatedAt">): Promise<CRMOpportunity> {
    await delay(400)
    const opp: CRMOpportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    opportunities.push(opp)
    pushAuditLog({ actor: "System", role: "system", action: "create", module: "crm", recordType: "CRMOpportunity", recordId: opp.id, ipAddress: "", newValue: `Created opportunity value ${opp.value}` })
    return opp
  }

  async updateStage(id: string, stage: CRMStage): Promise<void> {
    await delay(300)
    const opp = opportunities.find((o) => o.id === id)
    if (opp) {
      const prev = opp.currentStage
      opp.currentStage = stage
      opp.updatedAt = new Date().toISOString()
      pushAuditLog({ actor: "System", role: "system", action: "update_stage", module: "crm", recordType: "CRMOpportunity", recordId: id, ipAddress: "", previousValue: prev, newValue: stage })
    }
  }

  async updateOpportunity(id: string, data: Partial<CRMOpportunity>): Promise<void> {
    await delay(300)
    const opp = opportunities.find((o) => o.id === id)
    if (opp) {
      Object.assign(opp, data, { updatedAt: new Date().toISOString() })
      pushAuditLog({ actor: "System", role: "system", action: "update", module: "crm", recordType: "CRMOpportunity", recordId: id, ipAddress: "", newValue: `Updated opportunity ${id}` })
    }
  }

  async addActivity(id: string, activity: Omit<Activity, "id" | "createdAt">): Promise<void> {
    await delay(200)
    const opp = opportunities.find((o) => o.id === id)
    if (opp) {
      opp.activities.push({ ...activity, id: `act-${Date.now()}`, createdAt: new Date().toISOString() })
    }
  }

  async getPipelineStats(): Promise<Record<CRMStage, number>> {
    const stats: Record<string, number> = {}
    for (const opp of opportunities) {
      stats[opp.currentStage] = (stats[opp.currentStage] || 0) + 1
    }
    return stats as Record<CRMStage, number>
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
