import type { ISettingsService, PlatformSettings } from "./ISettingsService"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const defaults: PlatformSettings = {
  organizationName: "MemSyst",
  supportEmail: "support@memsyst.com",
  notificationEmail: "notifications@memsyst.com",
  autoAssignLeads: true,
  leadAssignmentRule: "round-robin",
  defaultLeadStatus: "new",
  crmDefaultProbability: "10",
  requireApprovalForTenants: true,
  auditRetentionDays: "365",
  emailNotifications: true,
  leadNotifications: true,
  crmNotifications: true,
  auditDigest: false,
}

let settings: PlatformSettings = { ...defaults }

export class MockSettingsService implements ISettingsService {
  async getSettings(): Promise<PlatformSettings | null> {
    await delay(150)
    return { ...settings }
  }

  async updateSettings(data: Partial<PlatformSettings>): Promise<void> {
    await delay(300)
    settings = { ...settings, ...data }
  }
}
