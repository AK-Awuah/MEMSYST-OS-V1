import type { IOrganizationStructureService } from "./IOrganizationStructureService"
import type { OrganizationalUnit, Region, Branch } from "@/types"
import { mockOrgUnits, mockRegions, mockBranches } from "./mock-data"

let orgUnits = [...mockOrgUnits]
let regions = [...mockRegions]
let branches = [...mockBranches]

export class MockOrganizationStructureService implements IOrganizationStructureService {
  async listOrgUnits(tenantId: string): Promise<OrganizationalUnit[]> {
    await delay(200); return orgUnits.filter((u) => u.tenantId === tenantId)
  }
  async createOrgUnit(data: Omit<OrganizationalUnit, "id" | "createdAt" | "updatedAt">): Promise<OrganizationalUnit> {
    await delay(400)
    const unit: OrganizationalUnit = { ...data, id: `ou-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    orgUnits.push(unit); return unit
  }
  async updateOrgUnit(id: string, data: Partial<OrganizationalUnit>): Promise<void> {
    await delay(300); const u = orgUnits.find((o) => o.id === id); if (u) Object.assign(u, data, { updatedAt: new Date().toISOString() })
  }
  async deactivateOrgUnit(id: string): Promise<void> {
    await delay(200); const u = orgUnits.find((o) => o.id === id); if (u) { u.status = "inactive"; u.updatedAt = new Date().toISOString() }
  }

  async listRegions(tenantId: string): Promise<Region[]> {
    await delay(200); return regions.filter((r) => r.tenantId === tenantId)
  }
  async createRegion(data: Omit<Region, "id" | "createdAt" | "updatedAt">): Promise<Region> {
    await delay(400)
    const region: Region = { ...data, id: `reg-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    regions.push(region); return region
  }
  async updateRegion(id: string, data: Partial<Region>): Promise<void> {
    await delay(300); const r = regions.find((reg) => reg.id === id); if (r) Object.assign(r, data, { updatedAt: new Date().toISOString() })
  }
  async deactivateRegion(id: string): Promise<void> {
    await delay(200); const r = regions.find((reg) => reg.id === id); if (r) { r.status = "inactive"; r.updatedAt = new Date().toISOString() }
  }

  async listBranches(tenantId: string): Promise<Branch[]> {
    await delay(200); return branches.filter((b) => b.tenantId === tenantId)
  }
  async getBranchesByRegion(regionId: string): Promise<Branch[]> {
    await delay(100); return branches.filter((b) => b.regionId === regionId)
  }
  async createBranch(data: Omit<Branch, "id" | "createdAt" | "updatedAt">): Promise<Branch> {
    await delay(400)
    const branch: Branch = { ...data, id: `br-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    branches.push(branch); return branch
  }
  async updateBranch(id: string, data: Partial<Branch>): Promise<void> {
    await delay(300); const b = branches.find((br) => br.id === id); if (b) Object.assign(b, data, { updatedAt: new Date().toISOString() })
  }
  async deactivateBranch(id: string): Promise<void> {
    await delay(200); const b = branches.find((br) => br.id === id); if (b) { b.status = "inactive"; b.updatedAt = new Date().toISOString() }
  }
}

function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)) }
