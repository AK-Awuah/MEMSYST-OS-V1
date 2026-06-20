import type { IGraduationService } from "./IGraduationService"
import type { Graduation, GraduationStatus } from "@/types"
import { mockGraduations } from "./mock-data"
import { delay } from "./shared-store"

export class MockGraduationService implements IGraduationService {
  private items = [...mockGraduations]

  async listGraduations(tenantId: string, params?: { status?: GraduationStatus; apprenticeId?: string }): Promise<Graduation[]> {
    await delay(200)
    let result = this.items.filter((g) => g.tenantId === tenantId)
    if (params?.status) result = result.filter((g) => g.status === params.status)
    if (params?.apprenticeId) result = result.filter((g) => g.apprenticeId === params.apprenticeId)
    return result
  }

  async getGraduation(id: string): Promise<Graduation | null> {
    await delay(100)
    return this.items.find((g) => g.id === id) || null
  }

  async createGraduation(data: Omit<Graduation, "id" | "createdAt" | "updatedAt">): Promise<Graduation> {
    await delay(200)
    const item: Graduation = {
      ...data,
      id: `grad-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(item)
    return item
  }

  async updateGraduation(id: string, data: Partial<Graduation>): Promise<Graduation> {
    await delay(150)
    const idx = this.items.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error("Graduation not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateGraduationStatus(id: string, status: GraduationStatus): Promise<Graduation> {
    await delay(150)
    const idx = this.items.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error("Graduation not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async approveGraduation(id: string): Promise<Graduation> {
    await delay(150)
    const idx = this.items.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error("Graduation not found")
    this.items[idx] = {
      ...this.items[idx],
      status: "graduated",
      graduationApproved: true,
      graduationDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async getByApprentice(apprenticeId: string, tenantId: string): Promise<Graduation[]> {
    await delay(100)
    return this.items.filter((g) => g.apprenticeId === apprenticeId && g.tenantId === tenantId)
  }

  async deleteGraduation(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((g) => g.id !== id)
  }
}
