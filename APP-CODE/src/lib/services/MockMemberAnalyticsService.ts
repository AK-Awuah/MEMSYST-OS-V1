import type { IMemberAnalyticsService } from "./IMemberAnalyticsService"
import type { MemberAnalytics } from "@/types"
import { mockMemberAnalytics } from "./mock-data"
import { delay } from "./shared-store"

export class MockMemberAnalyticsService implements IMemberAnalyticsService {
  async getAnalytics(_tenantId: string): Promise<MemberAnalytics> {
    await delay(200)
    return { ...mockMemberAnalytics }
  }
}
