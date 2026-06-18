import type { MemberAnalytics } from "@/types"

export interface IMemberAnalyticsService {
  getAnalytics(tenantId: string): Promise<MemberAnalytics>
}
