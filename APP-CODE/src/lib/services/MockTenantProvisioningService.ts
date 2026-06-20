import type { ITenantProvisioningService } from "./ITenantProvisioningService"
import type { Tenant } from "@/types"
import { mockTenants } from "./mock-data"

const tenants = [...mockTenants]

export class MockTenantProvisioningService implements ITenantProvisioningService {
  async getTenant(tenantId: string): Promise<Tenant | null> {
    await delay(100)
    return tenants.find((t) => t.tenantId === tenantId) || null
  }

  async listTenants(params?: { status?: string; search?: string }): Promise<Tenant[]> {
    await delay(200)
    let filtered = [...tenants]
    if (params?.status) filtered = filtered.filter((t) => t.commercialStatus === params.status)
    if (params?.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter((t) => t.organizationName.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q))
    }
    return filtered
  }

  async updateTenantStatus(tenantId: string, status: Tenant["commercialStatus"]): Promise<void> {
    await delay(200)
    const tenant = tenants.find((t) => t.tenantId === tenantId)
    if (tenant) tenant.commercialStatus = status
  }

  async getTenantSettings(tenantId: string): Promise<Record<string, unknown>> {
    await delay(100)
    return { theme: "dark", locale: "en-GH", timezone: "Africa/Accra" }
  }

  async updateTenantSettings(tenantId: string, settings: Record<string, unknown>): Promise<void> {
    await delay(200)
  }

  async prepareTenantProvisioning(tenantId: string): Promise<{ brandingReady: boolean; structureReady: boolean; membershipReady: boolean; financialReady: boolean }> {
    await delay(300)
    return {
      brandingReady: true,
      structureReady: false,
      membershipReady: false,
      financialReady: false,
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
