import type { ITrainingCenterService } from "./ITrainingCenterService"
import type { TrainingCenter, TrainingCenterStatus } from "@/types"
import { mockTrainingCenters } from "./mock-data"
import { delay } from "./shared-store"

export class MockTrainingCenterService implements ITrainingCenterService {
  private items = [...mockTrainingCenters]

  async listTrainingCenters(tenantId: string, params?: { status?: string; accreditationStatus?: TrainingCenterStatus }): Promise<TrainingCenter[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (params?.status) result = result.filter((c) => c.status === params.status)
    if (params?.accreditationStatus) result = result.filter((c) => c.accreditationStatus === params.accreditationStatus)
    return result
  }

  async getTrainingCenter(id: string): Promise<TrainingCenter | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async createTrainingCenter(data: Omit<TrainingCenter, "id" | "createdAt" | "updatedAt">): Promise<TrainingCenter> {
    await delay(200)
    const center: TrainingCenter = {
      ...data,
      id: `tc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(center)
    return center
  }

  async updateTrainingCenter(id: string, data: Partial<TrainingCenter>): Promise<TrainingCenter> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Training center not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async approveCenter(id: string): Promise<TrainingCenter> {
    await delay(100)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Training center not found")
    this.items[idx] = { ...this.items[idx], accreditationStatus: "active" as TrainingCenterStatus, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async suspendCenter(id: string): Promise<TrainingCenter> {
    await delay(100)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Training center not found")
    this.items[idx] = { ...this.items[idx], accreditationStatus: "suspended" as TrainingCenterStatus, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async renewAccreditation(id: string): Promise<TrainingCenter> {
    await delay(100)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Training center not found")
    this.items[idx] = { ...this.items[idx], accreditationStatus: "active" as TrainingCenterStatus, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteTrainingCenter(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((c) => c.id !== id)
  }
}
