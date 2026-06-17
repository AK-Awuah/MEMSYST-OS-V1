import type { IOrganizationService } from "./IOrganizationService"
import type { OrganizationProspect, Tenant } from "@/types"
import { mockProspects, mockTenants } from "./mock-data"
import { pushAuditLog } from "./shared-store"

let prospects = [...mockProspects]
let tenants = [...mockTenants]

export class MockOrganizationService implements IOrganizationService {
  async listProspects(): Promise<OrganizationProspect[]> {
    await delay(300)
    return [...prospects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getProspect(id: string): Promise<OrganizationProspect | null> {
    await delay(200)
    return prospects.find((p) => p.id === id) || null
  }

  async createProspect(data: Omit<OrganizationProspect, "id" | "createdAt" | "updatedAt">): Promise<OrganizationProspect> {
    await delay(400)
    const prospect: OrganizationProspect = {
      ...data,
      id: `prospect-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    prospects.push(prospect)
    pushAuditLog({ actor: "System", role: "system", action: "create", module: "organizations", recordType: "OrganizationProspect", recordId: prospect.id, ipAddress: "", newValue: `Created prospect ${prospect.organizationName}` })
    return prospect
  }

  async updateProspect(id: string, data: Partial<OrganizationProspect>): Promise<void> {
    await delay(300)
    const prospect = prospects.find((p) => p.id === id)
    if (prospect) {
      Object.assign(prospect, data, { updatedAt: new Date().toISOString() })
      pushAuditLog({ actor: "System", role: "system", action: "update", module: "organizations", recordType: "OrganizationProspect", recordId: id, ipAddress: "", newValue: `Updated prospect ${prospect.organizationName}` })
    }
  }

  async updateProspectStatus(id: string, status: OrganizationProspect["status"]): Promise<void> {
    await delay(300)
    const prospect = prospects.find((p) => p.id === id)
    if (prospect) {
      const prev = prospect.status
      prospect.status = status
      prospect.updatedAt = new Date().toISOString()
      pushAuditLog({ actor: "System", role: "system", action: "update_status", module: "organizations", recordType: "OrganizationProspect", recordId: id, ipAddress: "", previousValue: prev, newValue: status })
    }
  }

  async onboardTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant> {
    await delay(600)
    const tenant: Tenant = {
      ...data,
      id: `tenant-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tenants.push(tenant)
    pushAuditLog({ actor: "System", role: "system", action: "create", module: "tenants", recordType: "Tenant", recordId: tenant.id, ipAddress: "", newValue: `Onboarded tenant ${tenant.organizationName}` })
    return tenant
  }

  async listTenants(): Promise<Tenant[]> {
    await delay(300)
    return [...tenants]
  }

  async getTenant(id: string): Promise<Tenant | null> {
    await delay(200)
    return tenants.find((t) => t.id === id) || null
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
