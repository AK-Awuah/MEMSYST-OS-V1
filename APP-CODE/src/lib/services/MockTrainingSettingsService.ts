import type { ITrainingSettingsService } from "./ITrainingSettingsService"
import type { TrainingSettings } from "@/types"
import { mockTrainingSettings } from "./mock-data"
import { delay } from "./shared-store"

export class MockTrainingSettingsService implements ITrainingSettingsService {
  private settings = { ...mockTrainingSettings }

  async getSettings(tenantId: string): Promise<TrainingSettings | null> {
    await delay(100)
    if (this.settings.tenantId !== tenantId) return null
    return { ...this.settings }
  }

  async updateSettings(tenantId: string, data: Partial<TrainingSettings>): Promise<TrainingSettings> {
    await delay(150)
    if (this.settings.tenantId !== tenantId) throw new Error("Training settings not found for tenant")
    this.settings = { ...this.settings, ...data, updatedAt: new Date().toISOString() }
    return { ...this.settings }
  }

  async createSettings(data: Omit<TrainingSettings, "id" | "createdAt" | "updatedAt">): Promise<TrainingSettings> {
    await delay(200)
    this.settings = {
      ...data,
      id: `ts-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return { ...this.settings }
  }
}
