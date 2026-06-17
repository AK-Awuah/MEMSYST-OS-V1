import type { IOrganizationService } from "./IOrganizationService"
import type { OrganizationProspect, Tenant } from "@/types"

export class FirebaseOrganizationService implements IOrganizationService {
  async listProspects(): Promise<OrganizationProspect[]> { return [] }
  async getProspect(_id: string): Promise<OrganizationProspect | null> { return null }
  async createProspect(_data: Omit<OrganizationProspect, "id" | "createdAt" | "updatedAt">): Promise<OrganizationProspect> { throw new Error("Firebase not configured") }
  async updateProspect(_id: string, _data: Partial<OrganizationProspect>): Promise<void> {}
  async updateProspectStatus(_id: string, _status: OrganizationProspect["status"]): Promise<void> {}
  async onboardTenant(_data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant> { throw new Error("Firebase not configured") }
  async listTenants(): Promise<Tenant[]> { return [] }
  async getTenant(_id: string): Promise<Tenant | null> { return null }
}
