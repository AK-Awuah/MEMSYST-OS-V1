import type { TrainingSettings } from "@/types"

export interface ITrainingSettingsService {
  getSettings(tenantId: string): Promise<TrainingSettings | null>
  updateSettings(tenantId: string, data: Partial<TrainingSettings>): Promise<TrainingSettings>
  createSettings(data: Omit<TrainingSettings, "id" | "createdAt" | "updatedAt">): Promise<TrainingSettings>
}
