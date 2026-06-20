import type { IAssessmentService } from "./IAssessmentService"
import type { Assessment } from "@/types"
import { mockAssessments } from "./mock-data"
import { delay } from "./shared-store"

export class MockAssessmentService implements IAssessmentService {
  private items = [...mockAssessments]

  async listAssessments(tenantId: string, params?: { learnerId?: string; courseId?: string; type?: string; result?: string }): Promise<Assessment[]> {
    await delay(200)
    let result = this.items.filter((a) => a.tenantId === tenantId)
    if (params?.learnerId) result = result.filter((a) => a.learnerId === params.learnerId)
    if (params?.courseId) result = result.filter((a) => a.courseId === params.courseId)
    if (params?.type) result = result.filter((a) => a.assessmentType === params.type)
    if (params?.result) result = result.filter((a) => a.result === params.result)
    return result
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    await delay(100)
    return this.items.find((a) => a.id === id) || null
  }

  async createAssessment(data: Omit<Assessment, "id" | "createdAt" | "updatedAt">): Promise<Assessment> {
    await delay(200)
    const assessment: Assessment = {
      ...data,
      id: `assess-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(assessment)
    return assessment
  }

  async updateAssessment(id: string, data: Partial<Assessment>): Promise<Assessment> {
    await delay(150)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Assessment not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async getAssessmentsByLearner(learnerId: string, tenantId: string): Promise<Assessment[]> {
    await delay(100)
    return this.items.filter((a) => a.learnerId === learnerId && a.tenantId === tenantId)
  }

  async getByCourse(courseId: string, tenantId: string): Promise<Assessment[]> {
    await delay(100)
    return this.items.filter((a) => a.courseId === courseId && a.tenantId === tenantId)
  }

  async deleteAssessment(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((a) => a.id !== id)
  }
}
