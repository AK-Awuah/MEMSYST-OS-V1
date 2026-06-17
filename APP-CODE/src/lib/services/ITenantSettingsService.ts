import type { TenantSettings } from "@/types"

export interface ITenantSettingsService {
  getSettings(tenantId: string): Promise<TenantSettings | null>
  updateSettings(tenantId: string, data: Partial<TenantSettings>): Promise<void>
  getMembershipConfig(tenantId: string): Promise<TenantSettings["membership"]>
  updateMembershipConfig(tenantId: string, data: Partial<TenantSettings["membership"]>): Promise<void>
}
