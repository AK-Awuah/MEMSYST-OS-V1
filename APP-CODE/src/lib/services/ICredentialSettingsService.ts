import type { CredentialSettings } from "@/types"

export interface ICredentialSettingsService {
  getSettings(tenantId: string): Promise<CredentialSettings | null>
  updateSettings(tenantId: string, data: Partial<CredentialSettings>): Promise<CredentialSettings>
  initializeSettings(tenantId: string): Promise<CredentialSettings>
}
