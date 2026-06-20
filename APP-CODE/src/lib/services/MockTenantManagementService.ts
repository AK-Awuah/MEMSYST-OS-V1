import type { ITenantManagementService } from "./ITenantManagementService"
import type { Tenant, TenantProfile, TenantBranding, TenantAnalytics } from "@/types"
import { mockTenants, mockTenantProfiles, mockTenantBrandings, mockRegions, mockBranches, mockExecutiveAppointments } from "./mock-data"
import { recordIdentitySecurityEvent } from "./shared-store"

const tenants = [...mockTenants]
const profiles = [...mockTenantProfiles]
const brandings = [...mockTenantBrandings]

export class MockTenantManagementService implements ITenantManagementService {
  async listTenants(params?: { status?: string; search?: string }): Promise<Tenant[]> {
    await delay(200)
    let filtered = [...tenants]
    if (params?.status) filtered = filtered.filter((t) => t.status === params.status)
    if (params?.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter((t) => t.organizationName.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q))
    }
    return filtered
  }

  async getTenant(id: string): Promise<Tenant | null> {
    await delay(100)
    return tenants.find((t) => t.id === id) || null
  }

  async createTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant> {
    await delay(400)
    const tenant: Tenant = {
      ...data,
      id: `tenant-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tenants.push(tenant)
    recordIdentitySecurityEvent({ actorId: "system", actorName: "System", action: "tenant_created", resource: "tenants", tenantId: data.tenantId, result: "success", details: `Tenant created: ${data.organizationName}` })
    return tenant
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<void> {
    await delay(300)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) Object.assign(tenant, data, { updatedAt: new Date().toISOString() })
  }

  async updateTenantStatus(id: string, status: Tenant["status"]): Promise<void> {
    await delay(200)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) { tenant.status = status; tenant.updatedAt = new Date().toISOString() }
  }

  async updateCommercialStatus(id: string, status: Tenant["commercialStatus"]): Promise<void> {
    await delay(200)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) { tenant.commercialStatus = status; tenant.updatedAt = new Date().toISOString() }
  }

  async getProfile(tenantId: string): Promise<TenantProfile | null> {
    await delay(100)
    return profiles.find((p) => p.tenantId === tenantId) || null
  }

  async updateProfile(tenantId: string, data: Partial<TenantProfile>): Promise<void> {
    await delay(300)
    let profile = profiles.find((p) => p.tenantId === tenantId)
    if (profile) {
      Object.assign(profile, data, { updatedAt: new Date().toISOString() })
    } else {
      profile = { id: `tp-${Date.now()}`, tenantId, yearEstablished: 0, description: "", mission: "", vision: "", objectives: "", website: "", socialMediaLinks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data }
      profiles.push(profile)
    }
  }

  async getBranding(tenantId: string): Promise<TenantBranding | null> {
    await delay(100)
    return brandings.find((b) => b.tenantId === tenantId) || null
  }

  async updateBranding(tenantId: string, data: Partial<TenantBranding>): Promise<void> {
    await delay(300)
    let branding = brandings.find((b) => b.tenantId === tenantId)
    if (branding) {
      Object.assign(branding, data, { updatedAt: new Date().toISOString() })
    } else {
      branding = { id: `tb-${Date.now()}`, tenantId, logo: "", coverImage: "", primaryColor: "", secondaryColor: "", accentColor: "", typography: "", themeSettings: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data }
      brandings.push(branding)
    }
  }

  async activateTenant(id: string): Promise<void> {
    await delay(300)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) { tenant.status = "activated"; tenant.commercialStatus = "active"; tenant.updatedAt = new Date().toISOString() }
    recordIdentitySecurityEvent({ actorId: "system", actorName: "System", action: "tenant_activated", resource: "tenants", tenantId: id, result: "success" })
  }

  async suspendTenant(id: string): Promise<void> {
    await delay(300)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) { tenant.status = "activated"; tenant.commercialStatus = "suspended"; tenant.updatedAt = new Date().toISOString() }
    recordIdentitySecurityEvent({ actorId: "system", actorName: "System", action: "tenant_suspended", resource: "tenants", tenantId: id, result: "success" })
  }

  async reactivateTenant(id: string): Promise<void> {
    await delay(300)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) { tenant.status = "activated"; tenant.commercialStatus = "active"; tenant.updatedAt = new Date().toISOString() }
  }

  async archiveTenant(id: string): Promise<void> {
    await delay(300)
    const tenant = tenants.find((t) => t.id === id)
    if (tenant) { tenant.status = "activated"; tenant.commercialStatus = "archived"; tenant.updatedAt = new Date().toISOString() }
    recordIdentitySecurityEvent({ actorId: "system", actorName: "System", action: "tenant_archived", resource: "tenants", tenantId: id, result: "success" })
  }

  async getAnalytics(): Promise<TenantAnalytics> {
    await delay(200)
    const activeTenants = tenants.filter((t) => t.commercialStatus === "active").length
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return {
      totalTenants: tenants.length,
      activeTenants,
      totalRegions: mockRegions.length,
      totalBranches: mockBranches.length,
      totalExecutives: mockExecutiveAppointments.length,
      growthTrends: months.slice(0, 7).map((month, i) => ({
        month,
        count: Math.max(0, Math.floor(tenants.length * (i + 1) / 7)),
      })),
    }
  }
}

function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)) }
