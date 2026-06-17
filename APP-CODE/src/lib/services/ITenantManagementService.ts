import type { Tenant, TenantProfile, TenantBranding } from "@/types"

export interface ITenantManagementService {
  listTenants(params?: { status?: string; search?: string }): Promise<Tenant[]>
  getTenant(id: string): Promise<Tenant | null>
  createTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant>
  updateTenant(id: string, data: Partial<Tenant>): Promise<void>
  updateTenantStatus(id: string, status: Tenant["status"]): Promise<void>
  updateCommercialStatus(id: string, status: Tenant["commercialStatus"]): Promise<void>

  getProfile(tenantId: string): Promise<TenantProfile | null>
  updateProfile(tenantId: string, data: Partial<TenantProfile>): Promise<void>

  getBranding(tenantId: string): Promise<TenantBranding | null>
  updateBranding(tenantId: string, data: Partial<TenantBranding>): Promise<void>

  activateTenant(id: string): Promise<void>
  suspendTenant(id: string): Promise<void>
  reactivateTenant(id: string): Promise<void>
  archiveTenant(id: string): Promise<void>
}
