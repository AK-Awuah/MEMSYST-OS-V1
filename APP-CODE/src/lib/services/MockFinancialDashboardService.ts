import type { IFinancialDashboardService } from "./IFinancialDashboardService"
import type { FinancialDashboardMetrics, Transaction } from "@/types"
import { sharedWallets, sharedTransactions, sharedCommissions, sharedBills, sharedWithdrawals } from "./shared-store"
import { delay } from "./shared-store"

export class MockFinancialDashboardService implements IFinancialDashboardService {
  async getPlatformMetrics(): Promise<FinancialDashboardMetrics> {
    await delay(200)
    const wallets = sharedWallets
    const txns = sharedTransactions
    const commissions = sharedCommissions
    return {
      totalRevenue: txns.filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0),
      totalCommissions: commissions.reduce((s, c) => s + c.amount, 0),
      messagingRevenue: 0,
      activeWallets: wallets.filter((w) => w.status === "active").length,
      transactionVolume: txns.length,
      pendingWithdrawals: sharedWithdrawals.filter((w) => ["submitted", "under_review", "platform_review"].includes(w.status)).length,
      totalLockedFunds: wallets.reduce((s, w) => s + w.lockedBalance, 0),
      totalWalletUnits: wallets.reduce((s, w) => s + w.balance, 0),
      totalCollections: txns.filter((t) => t.type === "payment" && t.status === "successful").reduce((s, t) => s + t.amount, 0),
      outstandingBills: sharedBills.filter((b) => b.status === "due" || b.status === "overdue" || b.status === "partially_paid").reduce((s, b) => s + (b.amount - b.paidAmount), 0),
    }
  }

  async getTenantMetrics(tenantId: string): Promise<FinancialDashboardMetrics> {
    await delay(150)
    const wallets = sharedWallets.filter((w) => w.tenantId === tenantId)
    const txns = sharedTransactions.filter((t) => t.tenantId === tenantId)
    const commissions = sharedCommissions.filter((c) => c.tenantId === tenantId)
    return {
      totalRevenue: txns.filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0),
      totalCommissions: commissions.reduce((s, c) => s + c.amount, 0),
      messagingRevenue: 0,
      activeWallets: wallets.filter((w) => w.status === "active").length,
      transactionVolume: txns.length,
      pendingWithdrawals: sharedWithdrawals.filter((w) => w.tenantId === tenantId && ["submitted", "under_review", "platform_review"].includes(w.status)).length,
      totalLockedFunds: wallets.reduce((s, w) => s + w.lockedBalance, 0),
      totalWalletUnits: wallets.reduce((s, w) => s + w.balance, 0),
      totalCollections: txns.filter((t) => t.type === "payment" && t.status === "successful").reduce((s, t) => s + t.amount, 0),
      outstandingBills: sharedBills.filter((b) => b.tenantId === tenantId && (b.status === "due" || b.status === "overdue" || b.status === "partially_paid")).reduce((s, b) => s + (b.amount - b.paidAmount), 0),
    }
  }

  async getBranchMetrics(tenantId: string, branchId: string): Promise<FinancialDashboardMetrics> {
    await delay(100)
    const wallet = sharedWallets.find((w) => w.ownerId === branchId && w.type === "branch")
    const txns = wallet ? sharedTransactions.filter((t) => t.sourceWalletId === wallet.id || t.destinationWalletId === wallet.id) : []
    return {
      totalRevenue: txns.filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0),
      totalCommissions: 0,
      messagingRevenue: 0,
      activeWallets: wallet ? 1 : 0,
      transactionVolume: txns.length,
      pendingWithdrawals: wallet ? sharedWithdrawals.filter((w) => w.walletId === wallet.id && ["submitted", "under_review", "platform_review"].includes(w.status)).length : 0,
      totalLockedFunds: wallet?.lockedBalance || 0,
      totalWalletUnits: wallet?.balance || 0,
      totalCollections: txns.filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0),
      outstandingBills: 0,
    }
  }

  async getRecentTransactions(params?: { tenantId?: string; limit?: number }): Promise<Transaction[]> {
    await delay(100)
    let result = [...sharedTransactions]
    if (params?.tenantId) result = result.filter((t) => t.tenantId === params.tenantId)
    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (params?.limit) result = result.slice(0, params.limit)
    return result
  }
}
