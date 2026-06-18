import type { ICredentialSettingsService } from "./ICredentialSettingsService"
import type { CredentialSettings } from "@/types"
import { mockCredentialSettings } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialSettingsService implements ICredentialSettingsService {
  private items = new Map<string, CredentialSettings>()

  constructor() {
    if (mockCredentialSettings) {
      this.items.set(mockCredentialSettings.tenantId, { ...mockCredentialSettings })
    }
  }

  async getSettings(tenantId: string): Promise<CredentialSettings | null> {
    await delay(50)
    return this.items.get(tenantId) || null
  }

  async updateSettings(tenantId: string, data: Partial<CredentialSettings>): Promise<CredentialSettings> {
    await delay(100)
    const existing = this.items.get(tenantId)
    if (!existing) throw new Error("Settings not found")
    const updated: CredentialSettings = { ...existing, ...data, updatedAt: new Date().toISOString() }
    this.items.set(tenantId, updated)
    return updated
  }

  async initializeSettings(tenantId: string): Promise<CredentialSettings> {
    await delay(100)
    const existing = this.items.get(tenantId)
    if (existing) return existing
    const settings: CredentialSettings = {
      id: `cs-${Date.now()}`,
      tenantId,
      idCardReprintFee: 20,
      certificateReprintFee: 15,
      idCardExpiryMonths: 24,
      certificateExpiryMonths: 12,
      autoGenerateOnApproval: true,
      autoGenerateOnUpgrade: true,
      verificationRequiresAuth: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.set(tenantId, settings)
    return settings
  }
}
