import type { ITenantSettingsService } from "./ITenantSettingsService"
import type { TenantSettings } from "@/types"
import { mockTenantSettings } from "./mock-data"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
let settingsList = [...mockTenantSettings]

export class MockTenantSettingsService implements ITenantSettingsService {
  async getSettings(tenantId: string): Promise<TenantSettings | null> {
    await delay(100)
    return settingsList.find((s) => s.tenantId === tenantId) || null
  }

  async updateSettings(tenantId: string, data: Partial<TenantSettings>): Promise<void> {
    await delay(300)
    let settings = settingsList.find((s) => s.tenantId === tenantId)
    if (settings) Object.assign(settings, data, { updatedAt: new Date().toISOString() })
  }

  async getMembershipConfig(tenantId: string): Promise<TenantSettings["membership"]> {
    await delay(100)
    const settings = settingsList.find((s) => s.tenantId === tenantId)
    return settings?.membership || { categories: [], registrationRequirements: [], approvalRules: [], renewalRules: [] }
  }

  async updateMembershipConfig(tenantId: string, data: Partial<TenantSettings["membership"]>): Promise<void> {
    await delay(300)
    const settings = settingsList.find((s) => s.tenantId === tenantId)
    if (settings) {
      settings.membership = { ...settings.membership, ...data }
      settings.updatedAt = new Date().toISOString()
    }
  }
}
