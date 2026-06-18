import type { FinancialDashboardMetrics, Transaction } from "@/types"

export interface IFinancialDashboardService {
  getPlatformMetrics(): Promise<FinancialDashboardMetrics>
  getTenantMetrics(tenantId: string): Promise<FinancialDashboardMetrics>
  getBranchMetrics(tenantId: string, branchId: string): Promise<FinancialDashboardMetrics>
  getRecentTransactions(params?: { tenantId?: string; limit?: number }): Promise<Transaction[]>
}
