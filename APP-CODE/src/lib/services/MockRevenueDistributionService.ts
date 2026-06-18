import type { IRevenueDistributionService } from "./IRevenueDistributionService"
import type { RevenueDistributionRule, RevenueDistribution } from "@/types"
import { sharedRevenueRules, sharedRevenueDistributions, pushAuditLog } from "./shared-store"
import { delay } from "./shared-store"

let rules = [...sharedRevenueRules]
let distributions = [...sharedRevenueDistributions]

export class MockRevenueDistributionService implements IRevenueDistributionService {
  async listRules(tenantId: string): Promise<RevenueDistributionRule[]> {
    await delay(100)
    return rules.filter((r) => r.tenantId === tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getRule(id: string): Promise<RevenueDistributionRule | null> {
    await delay(50)
    return rules.find((r) => r.id === id) || null
  }

  async createRule(data: Omit<RevenueDistributionRule, "id" | "createdAt" | "updatedAt">): Promise<RevenueDistributionRule> {
    await delay(150)
    const rule: RevenueDistributionRule = { ...data, id: `rule-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    rules.unshift(rule)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "FINANCE", recordType: "RevenueRule", recordId: rule.id, newValue: `Rule created: ${rule.name}`, ipAddress: "127.0.0.1" })
    return rule
  }

  async updateRule(id: string, data: Partial<RevenueDistributionRule>): Promise<RevenueDistributionRule> {
    await delay(100)
    const idx = rules.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Rule not found")
    rules[idx] = { ...rules[idx], ...data, updatedAt: new Date().toISOString() }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "FINANCE", recordType: "RevenueRule", recordId: id, newValue: `Rule updated: ${rules[idx].name}`, ipAddress: "127.0.0.1" })
    return rules[idx]
  }

  async activateRule(id: string): Promise<void> {
    await delay(100)
    const idx = rules.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Rule not found")
    rules[idx] = { ...rules[idx], status: "active", updatedAt: new Date().toISOString() }
  }

  async deactivateRule(id: string): Promise<void> {
    await delay(100)
    const idx = rules.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Rule not found")
    rules[idx] = { ...rules[idx], status: "inactive", updatedAt: new Date().toISOString() }
  }

  async listDistributions(tenantId: string): Promise<RevenueDistribution[]> {
    await delay(100)
    return distributions.filter((d) => d.tenantId === tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}
