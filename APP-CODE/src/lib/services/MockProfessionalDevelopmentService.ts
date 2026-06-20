import type { IProfessionalDevelopmentService } from "./IProfessionalDevelopmentService"
import type { ProfessionalDevelopment } from "@/types"
import { mockProfessionalDevelopments } from "./mock-data"
import { delay } from "./shared-store"

export class MockProfessionalDevelopmentService implements IProfessionalDevelopmentService {
  private items = [...mockProfessionalDevelopments]

  async listProfessionalDevelopments(tenantId: string): Promise<ProfessionalDevelopment[]> {
    await delay(200)
    return this.items.filter((p) => p.tenantId === tenantId)
  }

  async getProfessionalDevelopment(id: string): Promise<ProfessionalDevelopment | null> {
    await delay(100)
    return this.items.find((p) => p.id === id) || null
  }

  async getByLearner(learnerId: string, tenantId: string): Promise<ProfessionalDevelopment[]> {
    await delay(100)
    return this.items.filter((p) => p.learnerId === learnerId && p.tenantId === tenantId)
  }

  async createProfessionalDevelopment(data: Omit<ProfessionalDevelopment, "id">): Promise<ProfessionalDevelopment> {
    await delay(200)
    const item: ProfessionalDevelopment = {
      ...data,
      id: `pd-${Date.now()}`,
    }
    this.items.push(item)
    return item
  }

  async updateProfessionalDevelopment(id: string, data: Partial<ProfessionalDevelopment>): Promise<ProfessionalDevelopment> {
    await delay(150)
    const idx = this.items.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Professional development record not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }
}
