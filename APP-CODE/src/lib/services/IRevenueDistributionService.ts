import type { RevenueDistributionRule, RevenueDistribution, DistributionSplit } from "@/types"

export interface IRevenueDistributionService {
  listRules(tenantId: string): Promise<RevenueDistributionRule[]>
  getRule(id: string): Promise<RevenueDistributionRule | null>
  createRule(data: Omit<RevenueDistributionRule, "id" | "createdAt" | "updatedAt">): Promise<RevenueDistributionRule>
  updateRule(id: string, data: Partial<RevenueDistributionRule>): Promise<RevenueDistributionRule>
  activateRule(id: string): Promise<void>
  deactivateRule(id: string): Promise<void>
  listDistributions(tenantId: string): Promise<RevenueDistribution[]>
}
