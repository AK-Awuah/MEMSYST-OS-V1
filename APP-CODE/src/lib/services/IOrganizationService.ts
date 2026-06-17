import type { OrganizationProspect, Tenant } from "@/types"

export interface IOrganizationService {
  listProspects(params?: {
    status?: string
    assignedTo?: string
  }): Promise<OrganizationProspect[]>
  getProspect(id: string): Promise<OrganizationProspect | null>
  createProspect(data: Omit<OrganizationProspect, "id" | "createdAt" | "updatedAt">): Promise<OrganizationProspect>
  updateProspect(id: string, data: Partial<OrganizationProspect>): Promise<void>
  updateProspectStatus(id: string, status: OrganizationProspect["status"]): Promise<void>
  onboardTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant>
  listTenants(): Promise<Tenant[]>
  getTenant(id: string): Promise<Tenant | null>
}
