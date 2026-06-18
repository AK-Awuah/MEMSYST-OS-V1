import type { ICredentialAnalyticsService } from "./ICredentialAnalyticsService"
import type { CredentialAnalytics } from "@/types"
import { mockIDCards, mockCertificates, mockPrintRequests } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialAnalyticsService implements ICredentialAnalyticsService {
  async getAnalytics(tenantId?: string): Promise<CredentialAnalytics> {
    await delay(200)
    return this.compute(tenantId)
  }

  async getTenantAnalytics(tenantId: string): Promise<CredentialAnalytics> {
    await delay(200)
    return this.compute(tenantId)
  }

  async getPlatformAnalytics(): Promise<CredentialAnalytics> {
    await delay(200)
    return this.compute()
  }

  private compute(tenantId?: string): CredentialAnalytics {
    const idCards = tenantId ? mockIDCards.filter((c) => c.tenantId === tenantId) : mockIDCards
    const certificates = tenantId ? mockCertificates.filter((c) => c.tenantId === tenantId) : mockCertificates
    const printRequests = tenantId ? mockPrintRequests.filter((r) => r.tenantId === tenantId) : mockPrintRequests
    const allCredentials = [...idCards, ...certificates]
    const active = allCredentials.filter((c) => c.status === "active")
    const cancelled = allCredentials.filter((c) => c.status === "cancelled")
    const totalReprints = allCredentials.reduce((sum, c) => sum + (c.reprintCount || 0), 0)
    const tenantMap = new Map<string, number>()
    allCredentials.forEach((c) => tenantMap.set(c.tenantId, (tenantMap.get(c.tenantId) || 0) + 1))
    const typeMap = new Map<string, number>()
    idCards.forEach(() => typeMap.set("id_card", (typeMap.get("id_card") || 0) + 1))
    certificates.forEach(() => typeMap.set("certificate", (typeMap.get("certificate") || 0) + 1))
    const statusMap = new Map<string, number>()
    allCredentials.forEach((c) => statusMap.set(c.status, (statusMap.get(c.status) || 0) + 1))

    return {
      totalCredentials: allCredentials.length,
      totalIDCards: idCards.length,
      totalCertificates: certificates.length,
      activeCredentials: active.length,
      totalReprints,
      cancelledCredentials: cancelled.length,
      pendingPrintRequests: printRequests.filter((r) => r.status === "pending").length,
      byTenant: Array.from(tenantMap.entries()).map(([tid, count]) => ({ tenantId: tid, count })),
      byType: Array.from(typeMap.entries()).map(([type, count]) => ({ type, count })),
      byStatus: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
      recentIssuances: [
        { date: "2026-04", count: 3 },
        { date: "2026-05", count: 1 },
        { date: "2026-06", count: 2 },
      ],
    }
  }
}
