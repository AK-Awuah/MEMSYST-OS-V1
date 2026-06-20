import type { ITrainingCertificationService } from "./ITrainingCertificationService"
import type { TrainingCertification } from "@/types"
import { mockTrainingCertifications } from "./mock-data"
import { delay } from "./shared-store"

export class MockTrainingCertificationService implements ITrainingCertificationService {
  private items = [...mockTrainingCertifications]

  async listCertifications(tenantId: string, params?: { learnerId?: string; type?: string; status?: string }): Promise<TrainingCertification[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (params?.learnerId) result = result.filter((c) => c.learnerId === params.learnerId)
    if (params?.type) result = result.filter((c) => c.type === params.type)
    if (params?.status) result = result.filter((c) => c.status === params.status)
    return result
  }

  async getCertification(id: string): Promise<TrainingCertification | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async issueCertification(data: Omit<TrainingCertification, "id" | "createdAt" | "updatedAt">): Promise<TrainingCertification> {
    await delay(200)
    const cert: TrainingCertification = {
      ...data,
      id: `tcert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(cert)
    return cert
  }

  async revokeCertification(id: string): Promise<TrainingCertification> {
    await delay(100)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Certification not found")
    this.items[idx] = { ...this.items[idx], status: "revoked", updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async getByLearner(learnerId: string, tenantId: string): Promise<TrainingCertification[]> {
    await delay(100)
    return this.items.filter((c) => c.learnerId === learnerId && c.tenantId === tenantId)
  }

  async deleteCertification(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((c) => c.id !== id)
  }
}
