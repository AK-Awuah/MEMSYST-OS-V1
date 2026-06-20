import type { TrainingAnalytics } from "@/types"

export interface ITrainingAnalyticsService {
  getAnalytics(tenantId?: string): Promise<TrainingAnalytics>
  getTenantAnalytics(tenantId: string): Promise<TrainingAnalytics>
  getPlatformAnalytics(): Promise<TrainingAnalytics>
}
