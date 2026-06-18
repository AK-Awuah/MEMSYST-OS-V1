import type { CommissionConfig, Commission } from "@/types"

export interface ICommissionService {
  listConfigs(): Promise<CommissionConfig[]>
  getConfig(id: string): Promise<CommissionConfig | null>
  createConfig(data: Omit<CommissionConfig, "id" | "createdAt" | "updatedAt">): Promise<CommissionConfig>
  updateConfig(id: string, data: Partial<CommissionConfig>): Promise<CommissionConfig>
  listCommissions(params?: { tenantId?: string; sourceType?: string }): Promise<Commission[]>
  getCommissionStats(params?: { tenantId?: string }): Promise<{ totalCommissions: number; bySource: Record<string, number> }>
}
