import type { Tenant } from "@/types"

export interface ITenantProvisioningService {
  getTenant(tenantId: string): Promise<Tenant | null>
  listTenants(params?: { status?: string; search?: string }): Promise<Tenant[]>
  updateTenantStatus(tenantId: string, status: Tenant["commercialStatus"]): Promise<void>
  getTenantSettings(tenantId: string): Promise<Record<string, unknown>>
  updateTenantSettings(tenantId: string, settings: Record<string, unknown>): Promise<void>
  prepareTenantProvisioning(tenantId: string): Promise<{
    brandingReady: boolean
    structureReady: boolean
    membershipReady: boolean
    financialReady: boolean
  }>
}
