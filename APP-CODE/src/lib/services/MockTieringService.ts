import type { ITieringService } from "./ITieringService"
import type { PremiumAccount, PremiumListing, VisibilityRule, TieringAuditLog, PremiumTier } from "@/types"
import { delay, pushAuditLog } from "./shared-store"

const accounts: PremiumAccount[] = []
const listings: PremiumListing[] = []
const rules: VisibilityRule[] = []

export class MockTieringService implements ITieringService {
  async listAccounts(tenantId: string): Promise<PremiumAccount[]> {
    await delay(200)
    return accounts.filter((a) => a.tenantId === tenantId)
  }

  async getAccount(id: string): Promise<PremiumAccount | null> {
    await delay(100)
    return accounts.find((a) => a.id === id) || null
  }

  async upgradeAccount(id: string, tier: PremiumTier): Promise<void> {
    await delay(200)
    const idx = accounts.findIndex((a) => a.id === id)
    if (idx !== -1) accounts[idx] = { ...accounts[idx], tier, status: "active", updatedAt: new Date().toISOString() }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "TIERING", recordType: "PremiumAccount", recordId: id, newValue: `Account upgraded to ${tier}`, ipAddress: "127.0.0.1" })
  }

  async downgradeAccount(id: string, tier: PremiumTier): Promise<void> {
    await delay(200)
    const idx = accounts.findIndex((a) => a.id === id)
    if (idx !== -1) accounts[idx] = { ...accounts[idx], tier, updatedAt: new Date().toISOString() }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "TIERING", recordType: "PremiumAccount", recordId: id, newValue: `Account downgraded to ${tier}`, ipAddress: "127.0.0.1" })
  }

  async cancelAccount(id: string): Promise<void> {
    await delay(150)
    const idx = accounts.findIndex((a) => a.id === id)
    if (idx !== -1) accounts[idx] = { ...accounts[idx], status: "cancelled", updatedAt: new Date().toISOString() }
  }

  async listListings(tenantId: string): Promise<PremiumListing[]> {
    await delay(200)
    return listings.filter((l) => l.tenantId === tenantId)
  }

  async getListing(id: string): Promise<PremiumListing | null> {
    await delay(100)
    return listings.find((l) => l.id === id) || null
  }

  async featureListing(id: string, featuredUntil?: string): Promise<void> {
    await delay(150)
    const idx = listings.findIndex((l) => l.id === id)
    if (idx !== -1) listings[idx] = { ...listings[idx], isFeatured: true, featuredUntil: featuredUntil || "", updatedAt: new Date().toISOString() }
  }

  async boostListing(id: string, boostFactor: number): Promise<void> {
    await delay(150)
    const idx = listings.findIndex((l) => l.id === id)
    if (idx !== -1) listings[idx] = { ...listings[idx], boostFactor, updatedAt: new Date().toISOString() }
  }

  async listRules(tenantId: string): Promise<VisibilityRule[]> {
    await delay(200)
    return rules.filter((r) => r.tenantId === tenantId)
  }

  async getRule(id: string): Promise<VisibilityRule | null> {
    await delay(100)
    return rules.find((r) => r.id === id) || null
  }

  async createRule(tenantId: string, data: Omit<VisibilityRule, "id" | "createdAt" | "updatedAt">): Promise<VisibilityRule> {
    await delay(200)
    const now = new Date().toISOString()
    const rule: VisibilityRule = { ...data, id: `rule-${Date.now()}`, tenantId, createdAt: now, updatedAt: now }
    rules.push(rule)
    return rule
  }

  async updateRule(id: string, data: Partial<VisibilityRule>): Promise<void> {
    await delay(150)
    const idx = rules.findIndex((r) => r.id === id)
    if (idx !== -1) rules[idx] = { ...rules[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async toggleRule(id: string, isActive: boolean): Promise<void> {
    await delay(100)
    const idx = rules.findIndex((r) => r.id === id)
    if (idx !== -1) rules[idx] = { ...rules[idx], isActive, updatedAt: new Date().toISOString() }
  }

  async getAuditLogs(tenantId: string): Promise<TieringAuditLog[]> {
    await delay(100)
    return []
  }
}
