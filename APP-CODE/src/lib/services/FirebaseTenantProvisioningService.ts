import type { ITenantProvisioningService } from "./ITenantProvisioningService"
import type { Tenant } from "@/types"

export class FirebaseTenantProvisioningService implements ITenantProvisioningService {
  async getTenant(_tenantId: string): Promise<Tenant | null> { return null }
  async listTenants(_params?: { status?: string; search?: string }): Promise<Tenant[]> { return [] }
  async updateTenantStatus(_tenantId: string, _status: Tenant["commercialStatus"]): Promise<void> {}
  async getTenantSettings(_tenantId: string): Promise<Record<string, unknown>> { return {} }
  async updateTenantSettings(_tenantId: string, _settings: Record<string, unknown>): Promise<void> {}
  async prepareTenantProvisioning(_tenantId: string): Promise<{ brandingReady: boolean; structureReady: boolean; membershipReady: boolean; financialReady: boolean }> {
    return { brandingReady: false, structureReady: false, membershipReady: false, financialReady: false }
  }
}
