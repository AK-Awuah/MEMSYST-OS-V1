import type { IApprenticeshipTrainingService } from "./IApprenticeshipTrainingService"
import type { ApprenticeshipTraining, ApprenticeshipTrainingStatus } from "@/types"
import { mockApprenticeshipTrainings } from "./mock-data"
import { delay } from "./shared-store"

export class MockApprenticeshipTrainingService implements IApprenticeshipTrainingService {
  private items = [...mockApprenticeshipTrainings]

  async listApprenticeshipTrainings(tenantId: string, params?: { status?: ApprenticeshipTrainingStatus; apprenticeId?: string; mentorId?: string }): Promise<ApprenticeshipTraining[]> {
    await delay(200)
    let result = this.items.filter((a) => a.tenantId === tenantId)
    if (params?.status) result = result.filter((a) => a.status === params.status)
    if (params?.apprenticeId) result = result.filter((a) => a.apprenticeId === params.apprenticeId)
    if (params?.mentorId) result = result.filter((a) => a.mentorId === params.mentorId)
    return result
  }

  async getApprenticeshipTraining(id: string): Promise<ApprenticeshipTraining | null> {
    await delay(100)
    return this.items.find((a) => a.id === id) || null
  }

  async createApprenticeshipTraining(data: Omit<ApprenticeshipTraining, "id" | "createdAt" | "updatedAt">): Promise<ApprenticeshipTraining> {
    await delay(200)
    const training: ApprenticeshipTraining = {
      ...data,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(training)
    return training
  }

  async updateApprenticeshipTraining(id: string, data: Partial<ApprenticeshipTraining>): Promise<ApprenticeshipTraining> {
    await delay(150)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Apprenticeship training not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateApprenticeshipProgress(id: string, progress: number): Promise<ApprenticeshipTraining> {
    await delay(100)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Apprenticeship training not found")
    this.items[idx] = { ...this.items[idx], progress, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateApprenticeshipStatus(id: string, status: ApprenticeshipTrainingStatus): Promise<ApprenticeshipTraining> {
    await delay(100)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Apprenticeship training not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async getByApprentice(apprenticeId: string, tenantId: string): Promise<ApprenticeshipTraining[]> {
    await delay(100)
    return this.items.filter((a) => a.apprenticeId === apprenticeId && a.tenantId === tenantId)
  }

  async deleteApprenticeshipTraining(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((a) => a.id !== id)
  }
}
