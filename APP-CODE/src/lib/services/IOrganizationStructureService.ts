import type { OrganizationalUnit, Region, Branch } from "@/types"

export interface IOrganizationStructureService {
  listOrgUnits(tenantId: string): Promise<OrganizationalUnit[]>
  createOrgUnit(data: Omit<OrganizationalUnit, "id" | "createdAt" | "updatedAt">): Promise<OrganizationalUnit>
  updateOrgUnit(id: string, data: Partial<OrganizationalUnit>): Promise<void>
  deactivateOrgUnit(id: string): Promise<void>

  listRegions(tenantId: string): Promise<Region[]>
  createRegion(data: Omit<Region, "id" | "createdAt" | "updatedAt">): Promise<Region>
  updateRegion(id: string, data: Partial<Region>): Promise<void>
  deactivateRegion(id: string): Promise<void>

  listBranches(tenantId: string): Promise<Branch[]>
  getBranchesByRegion(regionId: string): Promise<Branch[]>
  createBranch(data: Omit<Branch, "id" | "createdAt" | "updatedAt">): Promise<Branch>
  updateBranch(id: string, data: Partial<Branch>): Promise<void>
  deactivateBranch(id: string): Promise<void>
}
