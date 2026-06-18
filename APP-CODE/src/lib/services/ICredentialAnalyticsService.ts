import type { CredentialAnalytics } from "@/types"

export interface ICredentialAnalyticsService {
  getAnalytics(tenantId?: string): Promise<CredentialAnalytics>
  getTenantAnalytics(tenantId: string): Promise<CredentialAnalytics>
  getPlatformAnalytics(): Promise<CredentialAnalytics>
}
