import type { FinancialSettings } from "@/types"

export interface IFinancialSettingsService {
  getSettings(tenantId: string): Promise<FinancialSettings | null>
  updateSettings(tenantId: string, data: Partial<FinancialSettings>): Promise<FinancialSettings>
  getDefaultSettings(): FinancialSettings
}
