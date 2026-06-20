import type { ICommissionService } from "./ICommissionService"
import type { CommissionConfig, Commission } from "@/types"
import { sharedCommissionConfigs, sharedCommissions } from "./shared-store"
import { delay } from "./shared-store"

const configs = [...sharedCommissionConfigs]
const commissions = [...sharedCommissions]

export class MockCommissionService implements ICommissionService {
  async listConfigs(): Promise<CommissionConfig[]> {
    await delay(100)
    return [...configs]
  }

  async getConfig(id: string): Promise<CommissionConfig | null> {
    await delay(50)
    return configs.find((c) => c.id === id) || null
  }

  async createConfig(data: Omit<CommissionConfig, "id" | "createdAt" | "updatedAt">): Promise<CommissionConfig> {
    await delay(150)
    const config: CommissionConfig = { ...data, id: `cc-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    configs.unshift(config)
    return config
  }

  async updateConfig(id: string, data: Partial<CommissionConfig>): Promise<CommissionConfig> {
    await delay(100)
    const idx = configs.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Config not found")
    configs[idx] = { ...configs[idx], ...data, updatedAt: new Date().toISOString() }
    return configs[idx]
  }

  async listCommissions(params?: { tenantId?: string; sourceType?: string }): Promise<Commission[]> {
    await delay(100)
    let result = [...commissions]
    if (params?.tenantId) result = result.filter((c) => c.tenantId === params.tenantId)
    if (params?.sourceType) result = result.filter((c) => c.sourceType === params.sourceType)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getCommissionStats(params?: { tenantId?: string }): Promise<{ totalCommissions: number; bySource: Record<string, number> }> {
    await delay(100)
    const filtered = params?.tenantId ? commissions.filter((c) => c.tenantId === params.tenantId) : commissions
    const bySource: Record<string, number> = {}
    filtered.forEach((c) => { bySource[c.sourceType] = (bySource[c.sourceType] || 0) + c.amount })
    return { totalCommissions: filtered.reduce((s, c) => s + c.amount, 0), bySource }
  }
}
