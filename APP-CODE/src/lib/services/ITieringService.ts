import type { PremiumAccount, PremiumListing, VisibilityRule, TieringAuditLog, PremiumTier } from "@/types"

export interface ITieringService {
  listAccounts(tenantId: string): Promise<PremiumAccount[]>
  getAccount(id: string): Promise<PremiumAccount | null>
  upgradeAccount(id: string, tier: PremiumTier): Promise<void>
  downgradeAccount(id: string, tier: PremiumTier): Promise<void>
  cancelAccount(id: string): Promise<void>
  listListings(tenantId: string): Promise<PremiumListing[]>
  getListing(id: string): Promise<PremiumListing | null>
  featureListing(id: string, featuredUntil?: string): Promise<void>
  boostListing(id: string, boostFactor: number): Promise<void>
  listRules(tenantId: string): Promise<VisibilityRule[]>
  getRule(id: string): Promise<VisibilityRule | null>
  createRule(tenantId: string, data: Omit<VisibilityRule, "id" | "createdAt" | "updatedAt">): Promise<VisibilityRule>
  updateRule(id: string, data: Partial<VisibilityRule>): Promise<void>
  toggleRule(id: string, isActive: boolean): Promise<void>
  getAuditLogs(tenantId: string): Promise<TieringAuditLog[]>
}
