import type { IFinancialSettingsService } from "./IFinancialSettingsService"
import type { FinancialSettings } from "@/types"
import { sharedFinancialSettings } from "./shared-store"
import { delay } from "./shared-store"

export class MockFinancialSettingsService implements IFinancialSettingsService {
  async getSettings(tenantId: string): Promise<FinancialSettings | null> {
    await delay(50)
    if (sharedFinancialSettings.tenantId === tenantId) return { ...sharedFinancialSettings }
    return null
  }

  async updateSettings(tenantId: string, data: Partial<FinancialSettings>): Promise<FinancialSettings> {
    await delay(100)
    Object.assign(sharedFinancialSettings, data, { updatedAt: new Date().toISOString() })
    return { ...sharedFinancialSettings }
  }

  getDefaultSettings(): FinancialSettings {
    return {
      id: "fin-set-default",
      tenantId: "default",
      currency: "GHS",
      withdrawalFeePercent: 5,
      maxWithdrawalPercent: 80,
      monthlyWithdrawalLimit: 1,
      messagingCosts: { emailCost: 0.05, smsCost: 0.30, pushCost: 0.02 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}
